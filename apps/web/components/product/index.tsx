"use client";

import { formatProdcutTable } from "@/lib/format-product";
import { CategoryResult } from "@repo/api-client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Minus,
  Package,
  PackagePlus,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getProfit } from "@/components/order/product";
import LoadingImage from "@/components/ui/loading-image";
import { useDialog } from "@/hooks/use-dialog";
import {
  PhotosProps,
  ProductProps,
  SpecInventoriesProps,
} from "@repo/api-client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { systemToastSonner } from "../ui/system-toast-sonner";
import EditCategory from "./edit-category";
import ProductItem from "./product-item";

import { ICategoryAction } from "@/src/action/category/action";
import { IProductAction } from "@/src/action/product/action";
import { useAppTheme } from "@/src/context/theme-provider";
import { ProudctInListResult } from "@repo/api-client";

const currency = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

function formatDate(date?: Date | string) {
  if (!date) return "-";

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";

  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function globalProductFilter(
  row: Row<ProdcutTableProps>,
  _columnId: string,
  search: string,
) {
  if (!search) return true;

  const v = search.toLowerCase();
  const p = row.original;
  const tags = p.hashTag?.toLowerCase() ?? "";
  const subtitle = p.subtitle?.toLowerCase() ?? "";
  const description = p.description?.toLowerCase() ?? "";
  const specText = p.specInventories
    .map((spec) => `${spec.name} ${spec.spec}`.toLowerCase())
    .join(" ");

  return [p.name, p.categoryName, tags, subtitle, description, specText].some(
    (field) => field.toLowerCase().includes(v),
  );
}

// Category multi-select filterFn
function categoryMultiFilter(
  row: Row<ProdcutTableProps>,
  _columnId: string,
  selected: string[],
) {
  if (!selected || selected.length === 0) return true; // no filter
  return selected.includes(row.original.categoryName);
}

export interface ProdcutTableProps extends ProductProps {
  specInventories: SpecInventoriesProps[];
  photos: PhotosProps[];
}

export interface CategoriesTableProps {
  _id: string;
  name: string;
}

interface ProdcutCompProps {
  products?: ProudctInListResult[];
  categories?: CategoryResult;
  categoryAction: ICategoryAction;
  productAction: IProductAction;
}

export default function ProductComp(props: ProdcutCompProps) {
  const orgProducts = props.products || [];
  const categoryAction = props.categoryAction;
  const productAction = props.productAction;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useAppTheme();

  const [categoriesData, setCategoriesData] = useState<CategoryResult>(
    props.categories ?? [],
  );

  const [productData, setProductData] =
    useState<ProudctInListResult[]>(orgProducts);

  const tableData: ProdcutTableProps[] = useMemo(
    () => formatProdcutTable(productData),
    [productData],
  );

  const { openDialog, closeDialog } = useDialog();

  const productMap = useMemo(() => {
    return new Map(productData.map((item) => [item.product._id, item]));
  }, [productData]);

  // --------------- Table State ---------------
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    category: true,
    stock: true,
    soldToday: true,
  });

  const categories = useMemo(() => {
    const map = new Map<string, CategoriesTableProps>();

    tableData.forEach((item) => {
      map.set(item.categoryUuid.toString(), {
        _id: item.categoryUuid.toString(),
        name: item.categoryName,
      });
    });
    return Array.from(map.values());
  }, [tableData]);

  const selectedCategories: string[] =
    (columnFilters.find((f) => f.id === "category")?.value as string[]) || [];

  const activeFilterCount =
    selectedCategories.length + (globalFilter.trim() ? 1 : 0);

  // --------------- Columns ---------------
  const columns: ColumnDef<ProdcutTableProps>[] = [
    {
      id: "expand",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-col items-center justify-center">
          <Button
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
            }
            variant="ghost"
            className="h-9 w-9 rounded-lg border border-white/10 bg-slate-900/70 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {expanded[row.id] ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
          <div className={`mt-1 text-xs ${cls.text.muted}`}>
            規格({row.original.specInventories.length})
          </div>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "商品",
      cell: ({ row }) => {
        const product = row.original;
        const specInventories = row.original.specInventories;
        const hashTags: string[] = product.hashTag
          ? product.hashTag.split("#").filter((tag) => tag !== "")
          : [];
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-800">
              <LoadingImage
                fill
                src={specInventories[0].photo?.filename || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full"
              />
              {product.isHot && (
                <span className="absolute right-1 top-1 inline-flex items-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  HOT
                </span>
              )}
            </div>
            <div className="flex-1 min-w-48">
              <div
                className={`line-clamp-1 font-medium ${cls.text.title} text-left mt-2`}
              >
                {product.name}
              </div>
              <div
                className={`line-clamp-1 text-sm ${cls.text.muted} text-left`}
              >
                {product.subtitle}
              </div>
              <div className={`line-clamp-1 text-sm ${cls.text.sub} text-left`}>
                {product.description}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {hashTags.map((tag, i) => (
                  <span key={i} className={`${cls.badge.primary} text-xs `}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          分類 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      filterFn: categoryMultiFilter,
      cell: ({ row }) => {
        return (
          <span className={`${cls.badge.primary} text-xs `}>
            {row.original.categoryName}
          </span>
        );
      },
    },
    {
      accessorFn: (row) =>
        Math.min(...row.specInventories.map((s) => s.salePrice)),
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          價格 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const p = row.original;
        const specInventories = p.specInventories;
        const minPrice = Math.min(...specInventories.map((s) => s.salePrice));
        const maxPrice = Math.max(...specInventories.map((s) => s.salePrice));
        return (
          <div className="space-y-1">
            <div className={`font-semibold  ${cls.text.title}`}>
              {currency.format(minPrice)} - {currency.format(maxPrice)}
            </div>
          </div>
        );
      },
    },
    {
      accessorFn: (row) =>
        row.specInventories.reduce((acc, s) => acc + s.stock, 0),
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          總庫存 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const specInventories = row.original.specInventories;
        const stock = specInventories.reduce((acc, s) => acc + s.stock, 0);
        return (
          <div
            className={`text-center font-semibold ${stock < 10 ? cls.text.danger : cls.text.sub}`}
          >
            {stock}
          </div>
        );
      },
    },
    {
      accessorKey: "soldToday",
      header: "今日售出",
      cell: ({ row }) => (
        <span className={`font-semibold  ${cls.text.title}`}>
          {row.getValue("soldToday") as number}
        </span>
      ),
    },
    {
      accessorKey: "ratings",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 text-center  hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          評分 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className={`${cls.text.title} font-medium`}>
            {row.original.ratings}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          上架時間 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const startDate = row.original.startDate;
        if (!startDate) return null;
        return (
          <span className={`${cls.text.strong} text-xs `}>
            {formatDate(startDate)}
          </span>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          下架時間 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const endDate = row.original.endDate;
        if (!endDate) return null;
        return (
          <span className={`${cls.text.strong} text-xs `}>
            {formatDate(endDate)}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          建立日期 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        if (!createdAt) return null;
        return (
          <span className={`${cls.text.strong} text-xs `}>
            {formatDate(createdAt)}
          </span>
        );
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-2 hover:bg-slate-700 hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          最後更新時間 <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const updatedAt = row.original.updatedAt;
        if (!updatedAt) return null;
        return (
          <span className={`${cls.text.strong} text-xs `}>
            {formatDate(updatedAt)}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            className={`rounded-lg ${cls.button.success}  p-2`}
            onClick={() => {
              const product = productMap.get(row.original._id);
              const dialogId = openDialog({
                title: "編輯商品",
                type: (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900">
                    <PackagePlus size={24} className="text-white" />
                  </div>
                ),
                content: (
                  <ProductItem
                    type="edit"
                    categories={categoriesData}
                    product={product}
                    updateProduct={async (params, after) => {
                      try {
                        await productAction
                          .update?.(
                            product?.product._id.toString() ?? "",
                            params,
                          )
                          .then(() => {
                            closeDialog(dialogId);

                            systemToastSonner({
                              title: "編輯商品成功",
                              description: params.product.name,
                              type: "success",
                            });
                          });

                        await productAction.get?.({}).then((products) => {
                          setProductData(products ?? []);
                        });
                      } catch (err: any) {
                        after && after();
                        systemToastSonner({
                          title: "編輯商品失敗",
                          description: err.message,
                          type: "error",
                        });
                      }
                    }}
                    deleteSpec={async (productId, specId, after) => {
                      try {
                        const data = await productAction
                          .deleteSpec?.(productId, specId)
                          .then((data) => {
                            systemToastSonner({
                              title: "刪除規格成功",
                              description: "已刪除",
                              type: "success",
                            });
                            return data;
                          });
                        after?.(data);
                        await productAction.get?.({}).then((products) => {
                          setProductData(products ?? []);
                        });
                      } catch (err: any) {
                        after?.();
                        systemToastSonner({
                          title: "刪除規格失敗",
                          description: err.message,
                          type: "error",
                        });
                      }
                    }}
                  />
                ),
                size: "max-w-6xl",
              });
            }}
            title="編輯商品"
          >
            <Pencil size={20} />
          </button>
          <button
            className={`rounded-lg ${cls.button.danger}  p-2`}
            onClick={async () => {
              const product = productMap.get(row.original._id);
              try {
                await productAction
                  .deleteProduct?.(product?.product._id.toString() ?? "")
                  .then(() => {
                    systemToastSonner({
                      title: "刪除商品成功",
                      description: product?.product.name,
                      type: "success",
                    });
                  });

                await productAction.get?.({}).then((products) => {
                  setProductData(products ?? []);
                });
              } catch (err: any) {
                systemToastSonner({
                  title: "刪除商品失敗",
                  description: err.message,
                  type: "error",
                });
              }
            }}
            title="刪除商品"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // --------------- Table Instance ---------------
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: globalProductFilter,
  });

  // 選擇分類
  const toggleCategory = (cat: string) => {
    const col = table.getColumn("category");
    const current: string[] = (col?.getFilterValue() as string[]) || [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    col?.setFilterValue(next);

    // 更新 URL search params
    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) {
      params.set("category", next.join(","));
    } else {
      params.delete("category");
    }
    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
    );
  };

  // 監聽URLsearch params，更新分類篩選
  useEffect(() => {
    const initialCategoryFilter = searchParams.get("category");
    if (initialCategoryFilter) {
      const categories = initialCategoryFilter.split(",");
      table.getColumn("category")?.setFilterValue(categories);
    } else {
      table.getColumn("category")?.setFilterValue([]);
    }
  }, [searchParams]);

  const clearCategoryFilter = () => {
    table.getColumn("category")?.setFilterValue([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(
      params.toString() ? `${pathname}?${params.toString()}` : pathname,
    );
  };

  const getCategoryListHandler = async (): Promise<CategoryResult> => {
    try {
      const categories = JSON.parse(
        JSON.stringify((await categoryAction.get?.({})) || []),
      ); // 深拷貝
      setCategoriesData(categories);
      return categories; // ✅ 這裡 return 給外部 then
    } catch (err: any) {
      throw new Error("取得分類失敗:" + err);
    }
  };

  const stats = useMemo(() => {
    const newRow = table.getFilteredRowModel().rows.map((row) => row.original);
    const totalRating = newRow.reduce(
      (sum, item) => sum + (item.ratings ?? 0),
      0,
    );
    const totalStock = newRow.reduce(
      (sum, item) =>
        sum +
        item.specInventories.reduce(
          (specSum, spec) => specSum + Number(spec.stock ?? 0),
          0,
        ),
      0,
    );
    const totalRevenue = newRow.reduce((sum, item) => {
      const basePrice = item.specInventories[0]?.salePrice ?? 0;
      return sum + basePrice * (item.soldQty ?? 0);
    }, 0);

    return {
      totalProducts: newRow.length,
      totalSoldToday: newRow.reduce(
        (sum, item) => sum + (item.soldQty ?? 0),
        0,
      ),
      avgRating: newRow.length
        ? (totalRating / newRow.length).toFixed(1)
        : "0.0",
      totalStock,
      totalRevenue,
    };
  }, [table.getFilteredRowModel().rows]);

  const cls = theme.classes;

  return (
    <div className="flex text-white ">
      <div className={`flex-1 w-full pb-20 md:pb-0 !p-4 md:!p-6 lg:overflow-y-scroll lg:h-dvh lg:will-change-scroll lg:scrollbar-clean`}>
        <div
          className={`
              ${cls.section.card}
              mb-6 p-6
             flex flex-col gap-0`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div
                className={`${cls.text.strong} mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs`}
              >
                <Package className="h-3.5 w-3.5" />
                Product List
              </div>
              <h1 className={`text-3xl font-bold ${cls.text.title} `}>
                商品管理系統
              </h1>
            </div>

            <button
              className={cls.button.primaryWide}
              onClick={() => {
                const dialogId = openDialog({
                  title: "新增商品",
                  type: (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900">
                      <PackagePlus size={24} className="text-white" />
                    </div>
                  ),
                  content: (
                    <ProductItem
                      type="add"
                      categories={categoriesData}
                      createProduct={async (params, after) => {
                        try {
                          await productAction.create?.(params).then(() => {
                            closeDialog(dialogId);

                            systemToastSonner({
                              title: "新增商品成功",
                              description: params.product.name,
                              type: "success",
                            });
                          });

                          await productAction.get?.({}).then((products) => {
                            setProductData(products ?? []);
                          });
                        } catch (err: any) {
                          after && after();
                          systemToastSonner({
                            title: "新增商品失敗",
                            description: err.message,
                            type: "error",
                          });
                        }
                      }}
                    />
                  ),
                  size: "max-w-6xl",
                });
              }}
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              新增商品
            </button>
          </div>
          <AnimatePresence>
            <div className="">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-green-500/50"></div>
                <h3
                  className={`text-[14px] font-black ${cls.text.sub} tracking-[0.4em] uppercase`}
                >
                  用更清楚的搜尋、分類與列表結構來整理商品資料。
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="relative pl-6 border-l group border-green-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-3.5 h-3.5 text-green-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      總商品數
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalProducts}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {stats.totalProducts}
                      </span>
                    </motion.div>

                    <span className="text-base text-green-400 font-bold">
                      項
                    </span>
                  </div>
                </div>

                <div className="relative pl-6 border-l  group border-blue-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      今日銷量
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalSoldToday}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {stats.totalSoldToday}
                      </span>
                    </motion.div>
                    <span className="text-base text-blue-400 font-bold">
                      項
                    </span>
                  </div>
                </div>

                <div className="relative pl-6 border-l  group border-yellow-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-3.5 h-3.5 text-yellow-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      平均評分
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.avgRating}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light  ${cls.text.title} tracking-tighter`}
                      >
                        {stats.avgRating}
                      </span>
                    </motion.div>
                    <span className="text-base text-yellow-400 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </span>
                  </div>
                </div>

                <div className="relative pl-6 border-l  group border-purple-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-3.5 h-3.5 text-purple-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      總庫存
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalStock}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {currency.format(stats.totalStock)}
                      </span>
                    </motion.div>
                    <span className="text-base text-purple-400 font-bold">
                      件
                    </span>
                  </div>
                </div>
                <div className="relative pl-6 border-l  group border-purple-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      預估銷售額
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalRevenue}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {currency.format(stats.totalRevenue)}
                      </span>
                    </motion.div>
                    <span className="text-base text-purple-400 font-bold">
                      NT$
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatePresence>
        </div>

        <div className={`${cls.section.card} p-6`}>
          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-start">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_120px] xl:w-full xl:max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="搜尋商品名稱、副標、分類、標籤或規格"
                  className={`${cls.input.field} pl-10`}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className={`${cls.input.field}`}>
                    <span>
                      分類篩選
                      {selectedCategories.length > 0
                        ? ` (${selectedCategories.length})`
                        : ""}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  style={{ height: "auto", padding: "1rem 1rem" }}
                  className={`${cls.section.shell} `}
                >
                  <DropdownMenuLabel style={{ textAlign: "center" }}>
                    可多選擇分類
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((cat) => {
                    const checked = selectedCategories.includes(cat.name);
                    return (
                      <DropdownMenuCheckboxItem
                        key={cat._id}
                        className="capitalize cursor-pointer"
                        checked={checked}
                        onCheckedChange={() => toggleCategory(cat.name)}
                      >
                        {cat.name}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                  {selectedCategories.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={clearCategoryFilter}
                      >
                        清除分類篩選
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => {
                  openDialog({
                    title: "商品種類管理",
                    subTitle: "管理不同商品分類的設定",
                    type: <Package className="text-white" />,
                    content: (
                      <EditCategory
                        categories={categoriesData}
                        createCategory={async (data, after) => {
                          try {
                            await categoryAction.create?.(data);
                            const newCategories =
                              await getCategoryListHandler();
                            setCategoriesData(newCategories);
                            after && after(newCategories);
                            await productAction.get?.({}).then((products) => {
                              setProductData(products ?? []);
                            });
                          } catch (err: any) {
                            systemToastSonner({
                              title: "新增分類失敗",
                              description: err.message,
                              type: "error",
                            });
                          }
                        }}
                        updateCategory={async (id, data, after) => {
                          try {
                            await categoryAction.update?.(id, data);
                            const newCategories =
                              await getCategoryListHandler();
                            setCategoriesData(newCategories);
                            after && after(newCategories);
                            await productAction.get?.({}).then((products) => {
                              setProductData(products ?? []);
                            });
                          } catch (err: any) {
                            systemToastSonner({
                              title: "更新分類失敗",
                              description: err.message,
                              type: "error",
                            });
                          }
                        }}
                        deleteCategory={async (id, after) => {
                          try {
                            await categoryAction.deleteCategory?.(id);
                            const newCategories =
                              await getCategoryListHandler();
                            setCategoriesData(newCategories);
                            after && after(newCategories);
                            await productAction.get?.({}).then((products) => {
                              setProductData(products ?? []);
                            });
                          } catch (err: any) {
                            systemToastSonner({
                              title: "刪除分類失敗",
                              description: err.message,
                              type: "error",
                            });
                            after && after();
                          }
                        }}
                      />
                    ),
                    size: "max-w-xl",
                  });
                }}
                className={`inline-flexitems-center ${cls.button.iconSecondary}  py-2 px-4 `}
              >
                <Settings className="mr-2 h-4 w-4" />
                編輯分類
              </Button>

              {(globalFilter || selectedCategories.length > 0) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setGlobalFilter("");
                    clearCategoryFilter();
                  }}
                  className="border-white/10 bg-slate-900/70 text-white hover:bg-slate-800"
                >
                  清除篩選
                </Button>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span>目前共 {table.getFilteredRowModel().rows.length} 項商品</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-xs text-slate-300">
                已套用 {activeFilterCount} 個篩選條件
              </span>
            )}
          </div>

          <div
            className={`${cls.table.wrapper} overflow-hidden rounded-2xl font-mono `}
          >
            <Table className="w-full">
              <TableHeader className={cls.table.header}>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((h) => (
                      <TableHead
                        key={h.id}
                        className={`${cls.text.sub} text-center`}
                      >
                        {h.isPlaceholder
                          ? null
                          : flexRender(
                              h.column.columnDef.header,
                              h.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className={cls.table.divider}>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        className={`
                              ${cls.table.row} 
                               ${index % 2 === 0 ? cls.table.rowOdd : cls.table.rowEven}
                              cursor-pointer`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="align-middle text-center"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expanded[row.id] && (
                        <AnimatePresence mode="wait">
                          <TableRow className={`${cls.section.innerCard}`}>
                            <TableCell
                              colSpan={table.getAllLeafColumns().length}
                              className="p-0"
                            >
                              <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,800px)_320px]">
                                <div>
                                  <div className="mb-4 flex items-center justify-between">
                                    <h3
                                      className={`text-lg font-semibold ${cls.text.sub}`}
                                    >
                                      規格明細
                                    </h3>
                                    <div className={`${cls.badge.primary}`}>
                                      共 {row.original.specInventories.length}{" "}
                                      個品項
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {row.original.specInventories.map(
                                      (spec, index) => {
                                        const grossProfit =
                                          spec.salePrice - spec.cost;
                                        const discountRate =
                                          spec.originalPrice > spec.salePrice
                                            ? (
                                                ((spec.originalPrice -
                                                  spec.salePrice) /
                                                  spec.originalPrice) *
                                                100
                                              ).toFixed(0)
                                            : null;

                                        return (
                                          <div
                                            key={`specxx-${index}`}
                                            className={`rounded-2xl ${cls.table.detailsRow.card.body} p-4`}
                                          >
                                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                                              <div className="flex items-center gap-4">
                                                <div className="h-[72px] w-[72px] overflow-hidden rounded-2xl border border-white/10 bg-slate-800/80">
                                                  <LoadingImage
                                                    fill
                                                    src={
                                                      spec.photo?.filename ||
                                                      "/placeholder.png"
                                                    }
                                                    alt={spec.name}
                                                    className="h-full w-full object-cover"
                                                  />
                                                </div>

                                                <div className="min-w-0">
                                                  <div
                                                    className={`truncate text-base font-semibold ${cls.text.title}`}
                                                  >
                                                    {spec.name}
                                                  </div>
                                                  <div
                                                    className={`mt-1 truncate text-sm ${cls.text.sub}`}
                                                  >
                                                    {spec.spec}
                                                  </div>
                                                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                                    <span
                                                      className={`rounded-full !px-2 !py-0.5 ${cls.badge.active} ${cls.text.sub}`}
                                                    >
                                                      規格 #{index + 1}
                                                    </span>
                                                    <span
                                                      className={`rounded-full !px-2 !py-0.5 ${cls.badge.active} ${cls.text.sub}`}
                                                    >
                                                      排序{" "}
                                                      {Number(spec.rank ?? 0)}
                                                    </span>
                                                  </div>
                                                  <div
                                                    className={`mt-2 text-sm font-medium  ${cls.text.sub}`}
                                                  >
                                                    商品單價{" "}
                                                    {currency.format(
                                                      spec.salePrice,
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                                                <div
                                                  className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                                >
                                                  <div
                                                    className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                                  >
                                                    庫存
                                                  </div>
                                                  <div
                                                    className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                                  >
                                                    {Number(spec.stock)}
                                                  </div>
                                                </div>

                                                <div
                                                  className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                                >
                                                  <div
                                                    className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                                  >
                                                    銷售價
                                                  </div>
                                                  <div
                                                    className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                                  >
                                                    {currency.format(
                                                      spec.salePrice,
                                                    )}
                                                  </div>
                                                  {discountRate && (
                                                    <div className="mt-1 flex items-center gap-2">
                                                      <span className="text-xs text-slate-500 line-through">
                                                        {currency.format(
                                                          spec.originalPrice,
                                                        )}
                                                      </span>
                                                      <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-300">
                                                        -{discountRate}%
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>

                                                <div
                                                  className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                                >
                                                  <div
                                                    className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                                  >
                                                    原價
                                                  </div>
                                                  <div
                                                    className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                                  >
                                                    {currency.format(
                                                      spec.originalPrice,
                                                    )}
                                                  </div>
                                                </div>

                                                <div
                                                  className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                                >
                                                  <div
                                                    className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                                  >
                                                    成本
                                                  </div>
                                                  <div
                                                    className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                                  >
                                                    {currency.format(spec.cost)}
                                                  </div>
                                                </div>

                                                <div
                                                  className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                                >
                                                  <div
                                                    className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                                  >
                                                    VIP 價
                                                  </div>
                                                  <div
                                                    className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                                  >
                                                    {currency.format(
                                                      spec.vipPrice,
                                                    )}
                                                  </div>
                                                </div>

                                                <div
                                                  className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                                >
                                                  <div
                                                    className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                                  >
                                                    毛利率
                                                  </div>
                                                  <div className="mt-1 text-base font-semibold text-emerald-300">
                                                    {getProfit({
                                                      price: spec.salePrice,
                                                      cost: spec.cost,
                                                    })}
                                                    %
                                                  </div>
                                                  <div className="mt-1 text-xs text-slate-300">
                                                    毛利{" "}
                                                    {currency.format(
                                                      grossProfit,
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <div
                                              className={`${cls.table.detailsRow.card.badge} mt-3 grid gap-2 rounded-xl  p-3 text-xs  sm:grid-cols-2`}
                                            >
                                              <div className="truncate">
                                                規格 ID：
                                                {String(spec._id)}
                                              </div>
                                              <div className="truncate">
                                                商品 ID：
                                                {String(spec.productUuid)}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      },
                                    )}
                                  </div>
                                </div>

                                {(() => {
                                  const specs = row.original.specInventories;
                                  const totalCount = specs.length;
                                  const totalStock = specs.reduce(
                                    (acc, spec) =>
                                      acc + Number(spec.stock ?? 0),
                                    0,
                                  );
                                  const minSale = totalCount
                                    ? Math.min(
                                        ...specs.map((spec) => spec.salePrice),
                                      )
                                    : 0;
                                  const maxSale = totalCount
                                    ? Math.max(
                                        ...specs.map((spec) => spec.salePrice),
                                      )
                                    : 0;
                                  const priceSpread = maxSale - minSale;
                                  const discountCount = specs.filter(
                                    (spec) =>
                                      spec.originalPrice > spec.salePrice,
                                  ).length;
                                  const lowStockThreshold = 10;
                                  const lowStockSpecs = specs.filter(
                                    (spec) =>
                                      Number(spec.stock ?? 0) > 0 &&
                                      Number(spec.stock ?? 0) <=
                                        lowStockThreshold,
                                  );
                                  const outOfStockSpecs = specs.filter(
                                    (spec) => Number(spec.stock ?? 0) <= 0,
                                  );
                                  const avgSale = totalCount
                                    ? specs.reduce(
                                        (acc, spec) => acc + spec.salePrice,
                                        0,
                                      ) / totalCount
                                    : 0;
                                  const avgCost = totalCount
                                    ? specs.reduce(
                                        (acc, spec) => acc + spec.cost,
                                        0,
                                      ) / totalCount
                                    : 0;
                                  const avgProfitRate = totalCount
                                    ? specs.reduce((acc, spec) => {
                                        if (!spec.salePrice) {
                                          return acc;
                                        }

                                        return (
                                          acc +
                                          ((spec.salePrice - spec.cost) /
                                            spec.salePrice) *
                                            100
                                        );
                                      }, 0) / totalCount
                                    : 0;
                                  const avgVipDelta = totalCount
                                    ? specs.reduce((acc, spec) => {
                                        if (!spec.salePrice) {
                                          return acc;
                                        }

                                        return (
                                          acc +
                                          ((spec.salePrice - spec.vipPrice) /
                                            spec.salePrice) *
                                            100
                                        );
                                      }, 0) / totalCount
                                    : 0;
                                  const bestProfitSpec =
                                    specs.reduce<SpecInventoriesProps | null>(
                                      (best, spec) => {
                                        if (!spec.salePrice) return best;
                                        if (!best) return spec;

                                        const bestRate =
                                          ((best.salePrice - best.cost) /
                                            best.salePrice) *
                                          100;
                                        const currentRate =
                                          ((spec.salePrice - spec.cost) /
                                            spec.salePrice) *
                                          100;
                                        return currentRate > bestRate
                                          ? spec
                                          : best;
                                      },
                                      null,
                                    );
                                  const lowestProfitSpec =
                                    specs.reduce<SpecInventoriesProps | null>(
                                      (worst, spec) => {
                                        if (!spec.salePrice) return worst;
                                        if (!worst) return spec;

                                        const worstRate =
                                          ((worst.salePrice - worst.cost) /
                                            worst.salePrice) *
                                          100;
                                        const currentRate =
                                          ((spec.salePrice - spec.cost) /
                                            spec.salePrice) *
                                          100;
                                        return currentRate < worstRate
                                          ? spec
                                          : worst;
                                      },
                                      null,
                                    );
                                  const ranks = specs.map((spec) =>
                                    Number(spec.rank ?? 0),
                                  );
                                  const sortedRanks = [...ranks].sort(
                                    (a, b) => a - b,
                                  );
                                  const hasDuplicateRank =
                                    new Set(ranks).size !== ranks.length;
                                  const isRankContinuous =
                                    sortedRanks.length <= 1
                                      ? true
                                      : sortedRanks.every(
                                          (rank, idx) =>
                                            rank === sortedRanks[0] + idx,
                                        );

                                  return (
                                    <div
                                      className={`h-fit space-y-3 rounded-2xl ${cls.table.detailsRow.card.body} p-4 xl:sticky xl:top-4`}
                                    >
                                      <div>
                                        <div className="text-sm text-slate-400">
                                          規格摘要
                                        </div>
                                        <div
                                          className={`mt-1 text-xl font-semibold ${cls.text.sub}`}
                                        >
                                          {totalCount} 種規格
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div
                                          className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                        >
                                          <div
                                            className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                          >
                                            總庫存
                                          </div>
                                          <div
                                            className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                          >
                                            {totalStock}
                                          </div>
                                        </div>
                                        <div
                                          className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                        >
                                          <div
                                            className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                          >
                                            折扣覆蓋
                                          </div>
                                          <div
                                            className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                          >
                                            {discountCount}/{totalCount}
                                          </div>
                                        </div>
                                        <div
                                          className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                        >
                                          <div
                                            className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                          >
                                            最低售價
                                          </div>
                                          <div
                                            className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                          >
                                            {totalCount
                                              ? currency.format(minSale)
                                              : "-"}
                                          </div>
                                        </div>
                                        <div
                                          className={`rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                        >
                                          <div
                                            className={`text-xs ${cls.table.detailsRow.card.item.text}`}
                                          >
                                            最高售價
                                          </div>
                                          <div
                                            className={`mt-1 text-base font-semibold ${cls.table.detailsRow.card.item.title}`}
                                          >
                                            {totalCount
                                              ? currency.format(maxSale)
                                              : "-"}
                                          </div>
                                        </div>
                                      </div>

                                      <div
                                        className={`space-y-2 rounded-xl ${cls.table.detailsRow.card.item.body} p-3 text-sm`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span
                                            className={`text-xs ${cls.text.sub}`}
                                          >
                                            價格帶
                                          </span>
                                          <span
                                            className={`font-medium  ${cls.text.title}`}
                                          >
                                            {totalCount
                                              ? `${currency.format(minSale)} - ${currency.format(maxSale)}`
                                              : "-"}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            價差
                                          </span>
                                          <span
                                            className={`font-medium  ${cls.text.title}`}
                                          >
                                            {currency.format(priceSpread)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            平均售價 / 成本
                                          </span>
                                          <span
                                            className={`font-medium  ${cls.text.title}`}
                                          >
                                            {currency.format(avgSale)} /{" "}
                                            {currency.format(avgCost)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            平均毛利率
                                          </span>
                                          <span className="font-medium text-emerald-300">
                                            {avgProfitRate.toFixed(1)}%
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            平均 VIP 折讓
                                          </span>
                                          <span className="font-medium text-indigo-300">
                                            {avgVipDelta.toFixed(1)}%
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className={`space-y-2 rounded-xl ${cls.table.detailsRow.card.item.body} p-3 text-sm`}
                                      >
                                        <div
                                          className={`text-xs ${cls.text.sub}`}
                                        >
                                          庫存健康
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            低庫存 (≤{lowStockThreshold})
                                          </span>
                                          <span className="font-medium text-amber-300">
                                            {lowStockSpecs.length}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            缺貨規格
                                          </span>
                                          <span className="font-medium text-rose-300">
                                            {outOfStockSpecs.length}
                                          </span>
                                        </div>
                                        <div className="truncate text-xs text-slate-500">
                                          {lowStockSpecs.length
                                            ? `低庫存：${lowStockSpecs
                                                .slice(0, 3)
                                                .map((spec) => spec.spec)
                                                .join("、")}`
                                            : "低庫存：目前無"}
                                        </div>
                                      </div>

                                      <div
                                        className={`space-y-2 rounded-xl ${cls.table.detailsRow.card.item.body} p-3 text-sm`}
                                      >
                                        <div
                                          className={`text-xs ${cls.text.sub}`}
                                        >
                                          毛利與排序
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            最高毛利率
                                          </span>
                                          <span className="truncate pl-2 text-right font-medium text-emerald-300">
                                            {bestProfitSpec
                                              ? `${bestProfitSpec.spec} (${(
                                                  ((bestProfitSpec.salePrice -
                                                    bestProfitSpec.cost) /
                                                    bestProfitSpec.salePrice) *
                                                  100
                                                ).toFixed(1)}%)`
                                              : "-"}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            最低毛利率
                                          </span>
                                          <span className="truncate pl-2 text-right font-medium text-amber-300">
                                            {lowestProfitSpec
                                              ? `${lowestProfitSpec.spec} (${(
                                                  ((lowestProfitSpec.salePrice -
                                                    lowestProfitSpec.cost) /
                                                    lowestProfitSpec.salePrice) *
                                                  100
                                                ).toFixed(1)}%)`
                                              : "-"}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={` ${cls.text.sub}`}>
                                            排序完整性
                                          </span>
                                          <span
                                            className={`font-medium ${
                                              !hasDuplicateRank &&
                                              isRankContinuous
                                                ? "text-emerald-300"
                                                : "text-amber-300"
                                            }`}
                                          >
                                            {!hasDuplicateRank &&
                                            isRankContinuous
                                              ? "正常"
                                              : "需檢查"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </TableCell>
                          </TableRow>
                        </AnimatePresence>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow className="border-slate-800">
                    <TableCell
                      colSpan={table.getAllLeafColumns().length}
                      className="h-28 text-center text-slate-400"
                    >
                      目前沒有符合條件的商品資料
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className={`text-sm ${cls.text.sub}`}>
              顯示 {table.getRowModel().rows.length} 筆，目前篩選後共{" "}
              {table.getFilteredRowModel().rows.length} 筆
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${cls.text.sub}`}>每頁</span>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(v) => table.setPageSize(Number(v))}
                >
                  <SelectTrigger className={`w-[90px] p-2 ${cls.input.field}`}>
                    <SelectValue
                      placeholder={String(table.getState().pagination.pageSize)}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className={`!py-2 !px-1 ${cls.section.shell} cursor-pointer`}
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <SelectItem
                        className={`${cls.text.title} cursor-pointer`}
                        value={String(size)}
                        key={size}
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-slate-300">
                第 {table.getState().pagination.pageIndex + 1} /{" "}
                {table.getPageCount()} 頁
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className={cls.button.secondary}
                >
                  上一頁
                </Button>
                <Button
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className={cls.button.secondary}
                >
                  下一頁
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const tabVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};
