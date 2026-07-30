import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { systemToastSonner } from "@/components/ui/system-toast-sonner";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryResult } from "@repo/api-client";
import {
  CreateProductRequest,
  ProudctInListResult,
  UpdateProductRequest,
} from "@repo/api-client";
import { SpecInventoryResult } from "@repo/api-client";
import { PhotoUpdateParams } from "@repo/db/photo/index.type";
import { useMapState } from "@repo/ui/src/hooks/use-map-state";
import { format } from "date-fns";
import {
  CalendarDays,
  Camera,
  Check,
  Coffee,
  ImagePlus,
  Minus,
  Package,
  Plus,
  Save,
  Tag,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import {
  defaultProduct,
  defaultSpecInventories,
  productSchema,
  specInventoriesSchema,
} from "./form-zod";
import { paletteTheme as theme } from "@/lib/theme/palette-theme";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useAppTheme } from "@/src/context/theme-provider";

interface ProductItemProps {
  type: "add" | "edit";
  product?: ProudctInListResult;
  categories: CategoryResult;
  createProduct?: (params: CreateProductRequest, after?: () => void) => void;
  updateProduct?: (params: UpdateProductRequest, after?: () => void) => void;
  deleteSpec?: (
    productId: string,
    specId: string,
    after?: (data?: SpecInventoryResult) => void,
  ) => void;
}

export default function ProductItem(props: ProductItemProps) {
  const { product } = props;
  const { theme } = useAppTheme();

  const ProductInListSchema = z.object({
    product: productSchema,
    specInventories: z.array(specInventoriesSchema),
  });

  type FormValues = z.infer<typeof ProductInListSchema>;

  const defaultValues = {
    product: product
      ? {
          ...product.product,

          _id: product.product._id.toString(),
          categoryUuid: product.product.categoryUuid.toString(),
          startDate: product.product.startDate
            ? new Date(product.product.startDate)
            : undefined,
          endDate: product.product.endDate
            ? new Date(product.product.endDate)
            : undefined,
        }
      : defaultProduct,
    specInventories: product
      ? [
          ...product.specInventories.map((item, key) => {
            return {
              ...item,
              _id: item._id.toString(),
              photoTemp: product.photos[key]
                ? product.photos[key].filename
                : "",
            };
          }),
        ]
      : [defaultSpecInventories],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState,
  } = useForm<FormValues>({
    resolver: zodResolver(ProductInListSchema),
    defaultValues,
  });
  const { errors } = formState;

  const { fields, append, remove, swap, move } = useFieldArray({
    control,
    name: "specInventories",
  });
  const w_specInventories = useWatch({ control, name: "specInventories" });
  const w_product = useWatch({ control, name: "product" });
  const w_isShown = watch("product.isShow");

  const [tagInput, setTagInput] = useState("");
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const addTag = () => {
    if (tagInput.trim() === "") return;
    setValue(
      "product.hashTag",
      watch("product.hashTag") + `#${tagInput.trim()} `,
    );
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const currentTags = watch("product.hashTag")
      .split("#")
      .filter((item) => item !== "");
    const updatedTags = currentTags.filter((t) => t !== `${tag}`);
    setValue("product.hashTag", updatedTags.join("#"));
  };

  // 圖片預覽設定
  const previews = useMapState<string | null>();

  const { upload, isUploading } = useCloudinaryUpload({
    accept: "image/*",
    maxSizeMB: 3,
    onSuccess: (res) => {
      systemToastSonner({
        title: "上傳成功",
        description: `預覽產生中...`,
        type: "success",
      });
    },
    onError: (err) => {
      systemToastSonner({
        title: "刪除分類失敗",
        description: `上傳失敗：${err.message}`,
        type: "error",
      });
    },
  });

  const handlerUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files?.[0];

    const result = await upload(file);
    if (!result) {
      return;
    }

    const url = result.url;
    previews.set(`${activeSpecIndex}`, url);
    setValue(`specInventories.${activeSpecIndex}.photoTemp`, url);
  };

  useEffect(() => {
    //第一次進來把預覽圖片設定上去
    product?.photos.map((item, key) => {
      previews.set(`${key}`, item.filename);
    });

    // 元件卸載時，清理所有 URL
    return () => {};
  }, []);

  const onSubmit = (data: FormValues) => {
    setLoadingAdd(true);

    switch (props.type) {
      case "add":
        const createData: CreateProductRequest = {
          product: {
            ...data.product,
          },
          specInventories: data.specInventories.map((item) => {
            return {
              ...item,
              name: data.product.name + " " + item.spec,
            };
          }),
          photos: data.specInventories.map((item) => {
            return {
              filename: item.photoTemp,
              alt: item.spec,
            };
          }),
        };
        props.createProduct?.(createData, () => {
          setLoadingAdd(false);
        });
        break;
      case "edit":
        let photo_list: PhotoUpdateParams[] = [];
        const updateData: UpdateProductRequest = {
          product: {
            ...data.product,
            categoryUuid: data.product.categoryUuid.toString(),
          },
          specInventories: data.specInventories.map((spec, key) => {
            //舊有規格
            if (spec._id) {
              const photo = product?.photos.find(
                (item) => item.specUuid.toString() == spec._id,
              );

              photo_list.push({
                ...photo,
                _id: photo?._id.toString(),
                filename: spec.photoTemp,
                alt: spec.spec,
              });

              return {
                ...spec,
                name: data.product.name + " " + spec.spec,
              };
            } else {
              const temp_uuid = crypto.randomUUID();

              photo_list.push({
                filename: spec.photoTemp,
                alt: spec.spec,
                mark: temp_uuid,
              });

              return {
                ...spec,
                mark: temp_uuid,
                name: data.product.name + " " + spec.spec,
              };
            }
          }),
          photos: photo_list,
        };

        props.updateProduct?.(updateData, () => {
          setLoadingAdd(false);
        });
        break;
    }
  };
  const cls = theme.classes;

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="flex justify-end mb-4">
            <button
              type="submit"
              disabled={loadingAdd}
              className={` ${cls.button.primaryWide} `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 skew-x-12 -translate-x-full group-hover:translate-x-full transform duration-700"></div>
              <div className="relative flex items-center">
                <Save className="w-4 h-4 mr-2" />
                儲存商品
              </div>
            </button>
          </div>
          {/* 主要表單 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
            {/* 商品資訊 */}
            <div className="relative">
              <div
                className={`${cls.dialog.section}  p-4 backdrop-blur-sm md:p-6`}
              >
                <div className="flex items-center mb-6">
                  <div className={`${cls.icon.primaryChip} mr-4`}>
                    <Package className="" size={24} />
                  </div>
                  <div>
                    <h2 className={`text-sm ${cls.text.title}`}>商品資訊</h2>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                      <p className={`text-sm font-semibold ${cls.text.sub}`}>
                        基本商品設定
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品名稱 *
                    </label>
                    <input
                      type="text"
                      {...register("product.name")}
                      placeholder="輸入商品名稱"
                      className={`${cls.input.staticField} w-full`}
                    />
                    {errors.product?.name && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      副標題
                    </label>
                    <input
                      {...register("product.subtitle")}
                      placeholder="商品副標題"
                      className={`${cls.input.staticField} w-full `}
                    />
                    {errors.product?.subtitle && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.subtitle.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品描述
                    </label>
                    <textarea
                      {...register("product.description")}
                      placeholder="描述商品特色、口感等..."
                      rows={3}
                      className={`${cls.input.staticField} w-full `}
                    />
                    {errors.product?.description && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.description.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品分類 *
                    </label>
                    <select
                      {...register("product.categoryUuid")}
                      onChange={(e) => {
                        const categoryId = e.target.value;
                        const category = props.categories.find(
                          (c) => c._id === categoryId,
                        );

                        setValue("product.categoryUuid", categoryId, {
                          shouldValidate: true,
                        });
                        setValue("product.categoryName", category?.name ?? "", {
                          shouldValidate: true,
                        });
                      }}
                      className={`${cls.select.normal} w-full cursor-pointer`}
                    >
                      <option value="" className={`${cls.select.option}`}>
                        選擇分類
                      </option>
                      {props.categories.map((category, key) => (
                        <option
                          key={key}
                          value={category._id}
                          className={
                            w_product.categoryUuid === category._id
                              ? `${cls.select.optionActive}`
                              : `${cls.select.option} `
                          }
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.product?.categoryName && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.categoryName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      評價 *
                    </label>
                    <NumericRatingInput
                      value={getValues("product.ratings")}
                      onChange={(setRating) =>
                        setValue("product.ratings", setRating)
                      }
                      min={0}
                      max={5}
                      step={0.5}
                      cls={cls}
                    />
                    {errors.product?.ratings && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.ratings.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      是否可上架 *
                    </label>
                    <select
                      {...register("product.isShow", {
                        setValueAs: (val) => val === "true",
                      })}
                      className={`${cls.select.normal} w-full cursor-pointer`}
                    >
                      <option
                        value="true"
                        className={
                          w_isShown
                            ? `${cls.select.optionActive} `
                            : `${cls.select.option}`
                        }
                      >
                        是
                      </option>
                      <option
                        value="false"
                        className={
                          !w_isShown
                            ? `${cls.select.optionActive}`
                            : `${cls.select.option}`
                        }
                      >
                        否
                      </option>
                    </select>
                    {errors.product?.isShow && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.isShow.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      上架時間 - 結束時間
                    </label>
                    {/* 上架時間 */}
                    <div className="flex items-center gap-1 mb-4">
                      <Controller
                        control={control}
                        name="product.startDate"
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                className={cls.input.staticField}
                                variant="outline"
                              >
                                <CalendarDays />
                                {field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : "選擇上架時間"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      <Minus className={`${cls.text.title} w-5`} />
                      {/* 下架時間 */}
                      <Controller
                        control={control}
                        name="product.endDate"
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                className={cls.input.staticField}
                                variant="outline"
                              >
                                <CalendarDays />
                                {field.value
                                  ? format(field.value, "yyyy-MM-dd")
                                  : "選擇下架時間"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                    </div>
                    {errors.product?.startDate && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.startDate.message}
                      </p>
                    )}
                    {errors.product?.endDate && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.endDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`mb-2 block text-sm ${cls.text.strong}`}>
                      商品標籤
                    </label>
                    <div className={`${cls.section.mutedBlock2} space-y-4 p-4`}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            key: "is_new",
                            label: "新品",
                          },
                          {
                            key: "is_hot",
                            label: "熱銷",
                            color: "bg-red-600",
                          },
                          {
                            key: "is_special_offer",
                            label: "特價",
                          },
                        ].map((item, index) => (
                          <Controller
                            key={item.key}
                            name={`product.${item.key}` as keyof typeof product}
                            control={control}
                            render={({ field }) => {
                              const checked = !!field.value;
                              return (
                                <>
                                  <label
                                    className={`flex items-center gap-2  cursor-pointer ${cls.text.strong}`}
                                  >
                                    <input
                                      type="checkbox"
                                      {...field}
                                      checked={checked}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-5 h-5 rounded border-2  
                                        ${checked ? "bg-[#6F7BF7]" : "border-gray-500"} 
                                        flex items-center justify-center`}
                                    >
                                      {checked && (
                                        <Check className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                    <span className="text-sm ">
                                      {item.label}
                                    </span>
                                  </label>
                                </>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={``}>
                    <label
                      className={`mb-2 block text-sm ${cls.text.strong} text-sm font-medium  flex items-center justify-start`}
                    >
                      <Tag className="" size={24} /> 商品標籤
                    </label>

                    <div className={`${cls.section.mutedBlock2} space-y-4`}>
                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="輸入標籤名稱"
                          className={cls.input.staticField}
                          onKeyDown={(e) => e.key === "Enter" && addTag()}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addTag();
                          }}
                          className={cls.icon.primaryChip}
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(watch("product.hashTag") ?? "")
                          .split("#")
                          .filter((item) => item !== "")
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="flex items-center gap-2 rounded-xl 
                              border border-white/10 bg-slate-900/50 px-3 py-2 text-sm 
                              text-slate-200 transition-colors hover:bg-slate-800"
                            >
                              #{tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 規格選項 */}
            <div
              className={`relative ${cls.dialog.section} p-4 backdrop-blur-sm md:p-6`}
            >
              {/* 背景光效 */}

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`${cls.icon.primaryChip} mr-4`}>
                      <Coffee className="" size={24} />
                    </div>
                    <div>
                      <h2 className={`text-sm ${cls.text.title}`}>規格選項</h2>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
                        <p className={` text-sm font-semibold ${cls.text.sub}`}>
                          設定不同規格與選項
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 規格標籤列表 */}
                <div className="mb-3 flex items-center  justify-between">
                  <span className={` text-sm font-medium ${cls.text.title}`}>
                    規格 / 切換分頁
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      append(defaultSpecInventories);
                      setActiveSpecIndex(fields.length);
                    }}
                    className={`group relative overflow-hidden px-4 py-2 border-2
                    ${cls.button.primaryWide} 
                      font-medium  shadow-lg`}
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    新增規格
                  </button>
                </div>
                <div
                  className={`${cls.section.mutedBlock} border-2 w-full grid grid-cols-3 gap-2 rounded-2xl p-1`}
                >
                  {fields.map((field, index) => {
                    const btnCls =
                      activeSpecIndex === index
                        ? `mr-2 ${cls.button.primary} border-2`
                        : `px-4 py-2 text-sm border-2 mr-2 bg-[#2E3A54]/90 ${cls.button.secondary} border-2`;

                    return (
                      <div
                        key={field.id}
                        role="button"
                        className={`${btnCls}} break-all flex items-center gap-2 transition-all duration-300`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSpecIndex(index);
                        }}
                      >
                        {w_specInventories[index]?.spec || `規格 ${index + 1}`}

                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const spec = w_specInventories[index];
                              const productId = w_product._id;

                              if (spec._id === undefined) {
                                //沒有id直接刪除
                                remove(index);
                                previews.delete(`${index}`);
                                setActiveSpecIndex(0);
                                return;
                              }

                              props.deleteSpec?.(
                                productId ?? "",
                                spec._id,
                                (data) => {
                                  if (data) {
                                    remove(index);
                                    previews.delete(`${index}`);
                                    setActiveSpecIndex(0);
                                  }
                                },
                              );
                            }}
                            className="ml-auto flex h-5 w-5  items-center justify-center rounded-full
                           bg-white/10 text-slate-300 
                           hover:bg-white/20 hover:text-white group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpecIndex}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="md:p-4 xl:p-4 "
                  >
                    <div
                      className={`${cls.section.mutedBlock2} border-2 border-dashed mt-2`}
                    >
                      {/* 當前規格設定 */}
                      {fields[activeSpecIndex] && (
                        <div
                          role="tabpanel"
                          className="space-y-4 rounded-2xl  p-4 "
                        >
                          {/* 價格設定 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label
                                className={`mb-2 block text-sm ${cls.text.strong}`}
                              >
                                名稱 *
                              </label>
                              <input
                                key={activeSpecIndex}
                                type="text"
                                {...register(
                                  `specInventories.${activeSpecIndex}.spec` as const,
                                )}
                                placeholder="例：原味、草莓、巧克力"
                                className={`${cls.input.staticField} `}
                              />
                              {errors.specInventories?.[activeSpecIndex]?.spec
                                ?.message && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {
                                    errors.specInventories?.[activeSpecIndex]
                                      ?.spec.message
                                  }
                                </p>
                              )}
                            </div>

                            <div>
                              <label
                                className={`mb-2 block text-sm font-medium ${cls.text.strong}`}
                              >
                                價格 (NT$)
                              </label>
                              <input
                                type="number"
                                min={0}
                                {...register(
                                  `specInventories.${activeSpecIndex}.originalPrice`,
                                  {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const cleaned = Number(e.target.value);
                                      setValue(
                                        `specInventories.${activeSpecIndex}.originalPrice`,
                                        cleaned,
                                      );
                                    },
                                  },
                                )}
                                placeholder="0"
                                className={`${cls.input.staticField} `}
                              />

                              {errors.specInventories?.[activeSpecIndex]
                                ?.originalPrice?.message && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {
                                    errors.specInventories?.[activeSpecIndex]
                                      ?.originalPrice.message
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                className={`mb-2 block text-sm font-medium ${cls.text.strong}`}
                              >
                                {" "}
                                促銷價格 (NT$)
                              </label>
                              <input
                                type="number"
                                min={0}
                                {...register(
                                  `specInventories.${activeSpecIndex}.salePrice`,
                                  {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const cleaned = Number(e.target.value);
                                      setValue(
                                        `specInventories.${activeSpecIndex}.salePrice`,
                                        cleaned,
                                      );
                                    },
                                  },
                                )}
                                placeholder="0"
                                className={`${cls.input.staticField} `}
                              />

                              {errors.specInventories?.[activeSpecIndex]
                                ?.salePrice?.message && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {
                                    errors.specInventories?.[activeSpecIndex]
                                      ?.salePrice.message
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                className={`mb-2 block text-sm font-medium ${cls.text.strong}`}
                              >
                                VIP價格 (NT$)
                              </label>
                              <input
                                type="number"
                                min={0}
                                {...register(
                                  `specInventories.${activeSpecIndex}.vipPrice`,
                                  {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const cleaned = Number(e.target.value);
                                      setValue(
                                        `specInventories.${activeSpecIndex}.vipPrice`,
                                        cleaned,
                                      );
                                    },
                                  },
                                )}
                                placeholder="0"
                                className={`${cls.input.staticField} `}
                              />
                              {errors.specInventories?.[activeSpecIndex]
                                ?.vipPrice?.message && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {
                                    errors.specInventories?.[activeSpecIndex]
                                      ?.vipPrice.message
                                  }
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                className={`mb-2 block text-sm font-medium ${cls.text.strong}`}
                              >
                                成本 (NT$)
                              </label>
                              <input
                                type="number"
                                min={0}
                                {...register(
                                  `specInventories.${activeSpecIndex}.cost`,
                                  {
                                    valueAsNumber: true,
                                    onChange: (e) => {
                                      const cleaned = Number(e.target.value);
                                      setValue(
                                        `specInventories.${activeSpecIndex}.cost`,
                                        cleaned,
                                      );
                                    },
                                  },
                                )}
                                placeholder="0"
                                className={`${cls.input.staticField} `}
                              />
                              {errors.specInventories?.[activeSpecIndex]?.cost
                                ?.message && (
                                <p className=" mt-1 text-red-500 text-sm">
                                  {
                                    errors.specInventories?.[activeSpecIndex]
                                      ?.cost.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              className={`mb-2 block text-sm font-medium ${cls.text.strong}`}
                            >
                              庫存
                            </label>
                            <input
                              type="number"
                              min={0}
                              {...register(
                                `specInventories.${activeSpecIndex}.stock`,
                                {
                                  valueAsNumber: true,
                                  onChange: (e) => {
                                    const cleaned = Number(e.target.value);
                                    setValue(
                                      `specInventories.${activeSpecIndex}.stock`,
                                      cleaned,
                                    );
                                  },
                                },
                              )}
                              placeholder="0"
                              className={`${cls.input.staticField} `}
                            />
                            {errors.specInventories?.[activeSpecIndex]?.stock
                              ?.message && (
                              <p className=" mt-1 text-red-500 text-sm">
                                {
                                  errors.specInventories?.[activeSpecIndex]
                                    ?.stock.message
                                }
                              </p>
                            )}
                          </div>

                          {/* 圖片上傳 */}
                          <div>
                            <label
                              className={`mb-2 block text-sm font-medium ${cls.text.strong}`}
                            >
                              圖片
                            </label>
                            <label
                              htmlFor={`spec-image-${activeSpecIndex}`}
                              className="cursor-pointer"
                            >
                              <div className="border rounded-xl p-4 text-center border-[#3D52A0]/20 transition-all duration-300 cursor-pointer group bg-white/5 backdrop-blur-sm">
                                {isUploading ? (
                                  <>
                                    <p className={`${cls.text.sub}`}>
                                      上傳中...
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    {previews.get(
                                      activeSpecIndex.toString(),
                                    ) ? (
                                      <div className="relative">
                                        <img
                                          src={
                                            previews.get(
                                              activeSpecIndex.toString(),
                                            ) || undefined
                                          }
                                          alt="預覽"
                                          className="w-full h-auto object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                          <span className="text-white text-sm">
                                            點擊更換圖片
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="py-4">
                                        <div className={cls.dialog.mediaIcon}>
                                          <ImagePlus className="w-6 h-6 " />
                                        </div>
                                        <p className={`mt-3 text-sm font-medium ${cls.text.title}`}>
                                          點擊上傳圖片
                                        </p>
                                        <p className={`mt-3 text-sm font-medium ${cls.text.muted}`}>
                                          支援 JPG, PNG 格式
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </label>
                            <input
                              id={`spec-image-${activeSpecIndex}`}
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={(e) => {
                                handlerUploadImage(e);
                              }}
                              className="hidden"
                            />
                            {errors.specInventories?.[activeSpecIndex]
                              ?.photoTemp?.message && (
                              <p className=" mt-1 text-red-500 text-sm">
                                {
                                  errors.specInventories?.[activeSpecIndex]
                                    ?.photoTemp.message
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

interface NumericRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  cls: any;
}

export const NumericRatingInput: React.FC<NumericRatingInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 5,
  step = 0.5,
  cls = {},
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // 允許清空，不要立刻變 NaN
    if (raw === "") {
      onChange(min);
      return;
    }

    const inputValue = parseFloat(raw);

    if (!isNaN(inputValue)) {
      // clamp 保證數值在範圍內
      const clamped = Math.min(max, Math.max(min, inputValue));
      onChange(clamped);
    }
  };

  const increment = () => {
    const newValue = Math.min(max, +(value + step).toFixed(2));
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(min, +(value - step).toFixed(2));
    onChange(newValue);
  };

  return (
    <div className={`${cls.section.mutedBlock2} flex items-center gap-2 `}>
      <button
        type="button"
        disabled={value <= min}
        style={{
          padding: ".5rem",
        }}
        className={`${cls.button.iconSecondary} h-9 w-9  disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={decrement}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div
        className={`min-w-[56px] rounded-xl px-3 py-2 text-center text-sm font-semibold ${cls.input.staticField}`}
      >
        {value}
      </div>

      <button
        type="button"
        disabled={value >= max}
        style={{
          padding: ".5rem",
        }}
        className={`${cls.button.iconSecondary} h-9 w-9  disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={increment}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};
