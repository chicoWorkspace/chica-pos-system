"use client";

import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Package,
  Receipt,
  RefreshCcw,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingImage from "@/components/ui/loading-image";
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
import { IOrderAction } from "@/src/action/order/action";
import { useAppTheme } from "@/src/context/theme-provider";
import { OrdersResult } from "@repo/api-client";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

type OrderRow = OrdersResult[number];

interface PurchaseHistoryCompProps {
  orders?: OrdersResult;
  orderAction: IOrderAction;
}

const currency = new Intl.NumberFormat("zh-TW", {
  style: "decimal",
  currency: "TWD",
  maximumFractionDigits: 0,
});

function getOrderId(order: OrderRow) {
  return order.orderNumber ?? "";
}

function formatDate(date?: Date | string) {
  if (!date) return "-";

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "-";

  // 1. 取得格式化後的各個部件陣列
  const parts = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(value);

  // 2. 將部件組合，遇到 literal（通常是空格或分隔符號）且內容是空格時，替換成換行符號 \n
  return parts
    .map((part) =>
      part.type === "literal" && part.value === " " ? "\n" : part.value,
    )
    .join("");
}

function getStatusMeta(clsButton: any, status: OrderRow["status"]) {
  switch (status) {
    case "paid":
      return {
        label: "已付款",
        className: `${clsButton.success} min-h-8 min-w-16 text-center`,
      };
    case "cancelled":
      return {
        label: "已取消",
        className: `${clsButton.secondary} min-h-8 min-w-16 text-center`,
      };
    default:
      return {
        label: "待付款",
        className: `${clsButton.warning} min-h-8 min-w-16 text-center`,
      };
  }
}

function getPaymentLabel(method: OrderRow["payment"]["method"]) {
  switch (method) {
    case "cash":
      return "現金";
    case "credit":
      return "信用卡";
    case "linepay":
      return "LINE Pay";
    default:
      return method;
  }
}

export default function PurchaseHistoryComp(props: PurchaseHistoryCompProps) {
  const [ordersData, setOrdersData] = useState<OrdersResult>(
    props.orders ?? [],
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const searchParams = useSearchParams();
  const { theme } = useAppTheme();

  useEffect(() => {
    const initialOrderNumberFilter = searchParams.get("orderNumber");
    if (initialOrderNumberFilter) setSearch(initialOrderNumberFilter);
  }, []);

  useEffect(() => {
    setOrdersData(props.orders ?? []);
  }, [props.orders]);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return ordersData.filter((order) => {
      const orderId = getOrderId(order).toLowerCase();
      const staffName = order.staff?.username?.toLowerCase() ?? "";
      const itemNames = order.items
        .map((item) => item.snapshot.name.toLowerCase())
        .join(" ");

      const matchesSearch =
        !keyword ||
        orderId.includes(keyword) ||
        staffName.includes(keyword) ||
        itemNames.includes(keyword);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.payment.method === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [ordersData, paymentFilter, search, statusFilter]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalItems = filteredOrders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (itemSum, item) => itemSum + Number(item.quantity),
          0,
        ),
      0,
    );
    const totalAmount = filteredOrders.reduce(
      (sum, order) => sum + order.finalAmount,
      0,
    );

    return {
      totalOrders,
      totalItems,
      totalAmount,
      averageOrderAmount: totalOrders ? totalAmount / totalOrders : 0,
    };
  }, [filteredOrders]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / Number(pageSize)),
  );

  useEffect(() => {
    setPage(1);
  }, [pageSize, paymentFilter, search, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * Number(pageSize);
    return filteredOrders.slice(start, start + Number(pageSize));
  }, [filteredOrders, page, pageSize]);

  async function handleRefresh() {
    setIsRefreshing(true);
    try {
      const nextOrders = await props.orderAction.get({});
      setOrdersData(nextOrders ?? []);
    } finally {
      setIsRefreshing(false);
    }
  }
  const cls = theme.classes;

  return (
    <div className="flex text-white">
      <div
        className={`flex-1 w-full pb-20 px-4 pt-4 md:p-6 lg:overflow-y-scroll lg:h-dvh lg:will-change-scroll lg:scrollbar-clean`}
      >
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
                {" "}
                <Receipt className="h-3.5 w-3.5" />
                Purchase History
              </div>
              <h1 className={`text-3xl font-bold ${cls.text.title}`}>
                訂單購買紀錄
              </h1>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cls.button.primaryWide}
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              重新整理
            </button>
          </div>

          <AnimatePresence>
            <div className="">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 bg-green-500/50"></div>
                <h3
                  className={`text-[14px] font-black ${cls.text.sub} tracking-[0.4em] uppercase`}
                >
                  依照訂單資料檢視交易狀態、付款方式、品項與金額明細。
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="relative pl-6 border-l group border-green-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-green-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      {" "}
                      訂單數
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalOrders}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {stats.totalOrders}
                      </span>
                    </motion.div>

                    <span className="text-base text-green-400 font-bold">
                      筆
                    </span>
                  </div>
                </div>

                <div className="relative pl-6 border-l  group border-blue-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-3.5 h-3.5 text-blue-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      商品件數
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalItems}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {stats.totalItems}
                      </span>
                    </motion.div>
                    <span className="text-base text-blue-400 font-bold">
                      項
                    </span>
                  </div>
                </div>

                <div className="relative pl-6 border-l  group border-yellow-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-3.5 h-3.5 text-yellow-400 opacity-60" />

                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      總交易金額
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalItems}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light  ${cls.text.title} tracking-tighter`}
                      >
                        {currency.format(stats.totalAmount)}
                      </span>
                    </motion.div>
                    <span className="text-base text-yellow-400 font-bold">
                      NT$
                    </span>
                  </div>
                </div>

                <div className="relative pl-6 border-l  group border-purple-500/50 transition-colors duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <UserRound className="w-3.5 h-3.5 text-purple-400 opacity-60" />
                    <span
                      className={`text-[11px] font-bold ${cls.text.sub} uppercase tracking-wider`}
                    >
                      平均客單價
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.div
                      key={stats.totalItems}
                      initial={{
                        scale: 1.2,
                      }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span
                        className={`text-3xl font-light ${cls.text.title} tracking-tighter`}
                      >
                        {currency.format(stats.averageOrderAmount)}
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
          <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,480px)_180px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜尋訂單編號、店員或商品名稱"
                className={`${cls.input.field} pl-10`}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`${cls.input.field}`}>
                <SelectValue placeholder="訂單狀態" />
              </SelectTrigger>
              <SelectContent
                style={{ height: "auto", padding: "1rem 1rem" }}
                className={`${cls.section.shell} `}
              >
                <SelectItem className="capitalize cursor-pointer" value="all">
                  全部狀態
                </SelectItem>
                <SelectItem
                  className="capitalize cursor-pointer"
                  value="pending"
                >
                  待付款
                </SelectItem>
                <SelectItem className="capitalize cursor-pointer" value="paid">
                  已付款
                </SelectItem>
                <SelectItem
                  className="capitalize cursor-pointer"
                  value="cancelled"
                >
                  已取消
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className={`${cls.input.field}`}>
                <SelectValue placeholder="付款方式" />
              </SelectTrigger>
              <SelectContent
                style={{ height: "auto", padding: "1rem 1rem" }}
                className={`${cls.section.shell} `}
              >
                <SelectItem className="capitalize cursor-pointer" value="all">
                  全部付款方式
                </SelectItem>
                <SelectItem className="capitalize cursor-pointer" value="cash">
                  現金
                </SelectItem>
                <SelectItem
                  className="capitalize cursor-pointer"
                  value="credit"
                >
                  信用卡
                </SelectItem>
                <SelectItem
                  className="capitalize cursor-pointer"
                  value="linepay"
                >
                  LINE Pay
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className={`${cls.table.wrapper} overflow-hidden rounded-2xl font-mono `}
          >
            <Table className="w-full">
              <TableHeader className={cls.table.header}>
                <TableRow>
                  <TableHead
                    className={`${cls.text.sub} text-center`}
                  ></TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    訂單編號
                  </TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    建立時間
                  </TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    品項摘要
                  </TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    付款方式
                  </TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    狀態
                  </TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    金額
                  </TableHead>
                  <TableHead className={`${cls.text.sub} text-center`}>
                    店員
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className={cls.table.divider}>
                {pagedOrders.length ? (
                  pagedOrders.map((order, index) => {
                    const orderId = getOrderId(order);
                    const isExpanded = expandedId === orderId;
                    const statusMeta = getStatusMeta(cls.button, order.status);

                    return (
                      <React.Fragment key={orderId}>
                        <TableRow
                          onClick={() =>
                            setExpandedId(isExpanded ? null : orderId)
                          }
                          className={`
                              ${cls.table.row} 
                              ${index % 2 === 0 ? cls.table.rowOdd : cls.table.rowEven}
                              cursor-pointer`}
                        >
                          <TableCell>
                            <div className="flex flex-col items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg border border-white/10 bg-slate-900/70 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : orderId)
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div
                              className={`break-all ${cls.text.sub}  font-medium`}
                            >
                              {orderId}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <span className={`${cls.text.sub} text-xs `}>
                              {formatDate(order.createdAt)}
                            </span>
                          </TableCell>

                          <TableCell className="align-middle text-center max-w-96">
                            <div
                              className={`${cls.text.sub} text-xs line-clamp-2`}
                            >
                              {order.items
                                .map((item) => item.snapshot.name)
                                .join("、")}
                            </div>
                            <div className={`${cls.hr.body} my-2`} />
                            <div
                              className={`text-xs ${cls.text.strong} font-medium text-left`}
                            >
                              共{" "}
                              {order.items.reduce(
                                (sum, item) => sum + Number(item.quantity),
                                0,
                              )}{" "}
                              件
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div
                              className={`break-all ${cls.text.sub}  font-medium`}
                            >
                              {getPaymentLabel(order.payment.method)}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <span
                              className={`inline-flex px-3 py-1 text-xs ${statusMeta.className}`}
                            >
                              {statusMeta.label}
                            </span>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div
                              className={`break-all ${cls.text.sub} font-semibold `}
                            >
                              {currency.format(order.finalAmount)}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-center">
                            <div
                              className={`break-all ${cls.text.sub} font-medium `}
                            >
                              {order.staff?.username ?? "-"}
                            </div>
                          </TableCell>
                        </TableRow>

                        {isExpanded && (
                          <TableRow className={`${cls.section.innerCard}`}>
                            <TableCell colSpan={8} className="p-0">
                              <div className="grid gap-6 p-5 xl:grid-cols-[minmax(0,500px)_280px]">
                                <div>
                                  <div className="mb-4 flex items-center justify-between">
                                    <h3
                                      className={`text-lg font-semibold ${cls.text.sub}`}
                                    >
                                      訂單明細
                                    </h3>
                                    <div className={`${cls.badge.primary}`}>
                                      共 {order.items.length} 個品項
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                      <div
                                        key={`${orderId}-${index}`}
                                        className={`flex flex-col gap-3 rounded-2xl ${cls.table.detailsRow.card.body} p-4 md:flex-row md:items-center md:justify-between `}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className=" h-16 w-16 overflow-hidden rounded-2xl bg-slate-800">
                                            <LoadingImage
                                              fill
                                              src={
                                                item.snapshot.photo?.filename ||
                                                "/placeholder.png"
                                              }
                                              alt={item.snapshot.name}
                                              className="object-cover w-full h-full"
                                            />
                                          </div>

                                          <div>
                                            <div
                                              className={`truncate text-base font-semibold ${cls.text.title}`}
                                            >
                                              {item.snapshot.name}
                                            </div>
                                            <div
                                              className={`mt-1 truncate text-sm ${cls.text.sub}`}
                                            >
                                              {item.snapshot.categoryName}
                                            </div>
                                            <div
                                              className={`mt-2 text-sm font-medium  ${cls.text.sub}`}
                                            >
                                              商品單價{" "}
                                              {currency.format(
                                                item.snapshot.price,
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm">
                                          <div>
                                            <div className={`${cls.text.sub}`}>
                                              數量
                                            </div>
                                            <div
                                              className={`mt-1 text-center font-medium ${cls.text.sub}`}
                                            >
                                              {Number(item.quantity)}
                                            </div>
                                          </div>
                                          <div>
                                            <div className={`${cls.text.sub}`}>
                                              小計
                                            </div>
                                            <div className="mt-1 font-semibold text-emerald-300">
                                              {currency.format(item.subtotal)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div
                                  className={`h-fit rounded-2xl border ${cls.table.detailsRow.card.body} p-5`}
                                >
                                  <h3
                                    className={`mb-4 text-lg font-semibold ${cls.text.sub}`}
                                  >
                                    付款資訊
                                  </h3>

                                  <div
                                    className={`space-y-4 text-sm rounded-xl ${cls.table.detailsRow.card.item.body} p-3`}
                                  >
                                    <div className="flex items-center justify-between ">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        訂單狀態
                                      </div>
                                      <span className={` ${cls.text.sub}`}>
                                        {statusMeta.label}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        付款方式
                                      </div>
                                      <span className={` ${cls.text.sub}`}>
                                        {getPaymentLabel(order.payment.method)}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        付款時間
                                      </div>
                                      <span className={` ${cls.text.sub}`}>
                                        {formatDate(order.payment.paidAt)}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        店員
                                      </div>
                                      <span className={` ${cls.text.sub}`}>
                                        {order.staff?.username ?? "-"}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        原始金額
                                      </div>
                                      <span className={` ${cls.text.sub}`}>
                                        {currency.format(order.totalAmount)}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        折扣
                                      </div>
                                      <span className={` ${cls.text.sub}`}>
                                        {currency.format(order.discountAmount)}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between text-base">
                                      <div
                                        className={`text-xs ${cls.text.sub}`}
                                      >
                                        實收金額
                                      </div>
                                      <span className="font-bold text-emerald-300">
                                        {currency.format(order.finalAmount)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <TableRow className="border-slate-800">
                    <TableCell
                      colSpan={8}
                      className="h-28 text-center text-slate-400"
                    >
                      目前沒有符合條件的訂單資料
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-400">
              顯示{" "}
              {(page - 1) * Number(pageSize) + (pagedOrders.length ? 1 : 0)}-
              {(page - 1) * Number(pageSize) + pagedOrders.length} 筆，共{" "}
              {filteredOrders.length} 筆
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${cls.text.sub}`}>每頁</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className={`w-[90px] p-2 ${cls.input.field}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={`${cls.text.title} cursor-pointer`}>
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
                第 {page} / {totalPages} 頁
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className={cls.button.secondary}
                >
                  上一頁
                </Button>
                <Button
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page >= totalPages}
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
