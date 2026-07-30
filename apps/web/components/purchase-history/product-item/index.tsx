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

interface ProductItemProps {
  type: "add" | "edit";
  product?: ProudctInListResult;
  categories: CategoryResult;
  createProduct?: (params: CreateProductRequest, after?: () => void) => void;
  updateProduct?: (params: UpdateProductRequest, after?: () => void) => void;
  deleteSpec?: (
    productId: string,
    specId: string,
    after?: (data?: SpecInventoryResult) => void
  ) => void;
}

export default function ProductItem(props: ProductItemProps) {
  const { product } = props;

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
      watch("product.hashTag") + `#${tagInput.trim()} `
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
                (item) => item.specUuid.toString() == spec._id
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mb-4">
            <Button
              type="submit"
              disabled={loadingAdd}
              className="block ml-auto group relative overflow-hidden 
              bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:via-violet-500 hover:to-indigo-500
              text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 skew-x-12 -translate-x-full group-hover:translate-x-full transform duration-700"></div>
              <div className="relative flex items-center">
                <Save className="w-4 h-4 mr-2" />
                儲存商品
              </div>
            </Button>
          </div>
          {/* 主要表單 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 商品資訊 */}
            <div className="relative">
              {/* 背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl"></div>

              {/* 浮動圓點裝飾 */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400/50 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400 rounded-full"></div>

              <div className="relative lg:p-6 p-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Package className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">商品資訊</h2>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
                      <p className="text-slate-300 text-sm">基本商品設定</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      商品名稱 *
                    </label>
                    <input
                      type="text"
                      {...register("product.name")}
                      placeholder="輸入商品名稱"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    />
                    {errors.product?.name && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      副標題
                    </label>
                    <input
                      {...register("product.subtitle")}
                      placeholder="商品副標題"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm resize-none"
                    />
                    {errors.product?.subtitle && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.subtitle.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      商品描述
                    </label>
                    <textarea
                      {...register("product.description")}
                      placeholder="描述商品特色、口感等..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm resize-none"
                    />
                    {errors.product?.description && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.description.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      商品分類 *
                    </label>
                    <select
                      {...register("product.categoryUuid")}
                      onChange={(e) => {
                        const categoryId = e.target.value;
                        const category = props.categories.find(
                          (c) => c._id === categoryId
                        );

                        setValue("product.categoryUuid", categoryId, {
                          shouldValidate: true,
                        });
                        setValue(
                          "product.categoryName",
                          category?.name ?? "",
                          { shouldValidate: true }
                        );
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="" className="bg-slate-800">
                        選擇分類
                      </option>
                      {props.categories.map((category, key) => (
                        <option
                          key={key}
                          value={category._id}
                          className="bg-slate-800"
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
                    <label className="block text-sm font-medium text-slate-200 mb-2">
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
                    />
                    {errors.product?.ratings && (
                      <p className=" mt-1 text-red-500 text-sm">
                        {errors.product?.ratings.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      是否可上架 *
                    </label>
                    <select
                      {...register("product.isShow", {
                        setValueAs: (val) => val === "true",
                      })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="true" className="bg-slate-800">
                        是
                      </option>
                      <option value="false" className="bg-slate-800">
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
                    <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                className="bg-white/10 border border-white/20 
                                  focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 
                                  backdrop-blur-sm rounded-xl text-white"
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
                      <Minus className="text-white w-3" />
                      {/* 下架時間 */}
                      <Controller
                        control={control}
                        name="product.endDate"
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                className="bg-white/10 border border-white/20
                                   focus:outline-none focus:border-indigo-400/80 focus:bg-white/20 transition-all duration-300 
                                   backdrop-blur-sm rounded-xl text-white"
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
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      商品標籤
                    </label>
                    <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            key: "is_new",
                            label: "新品",
                            color: "bg-green-600",
                          },
                          {
                            key: "is_hot",
                            label: "熱銷",
                            color: "bg-red-600",
                          },
                          {
                            key: "is_special_offer",
                            label: "特價",
                            color: "bg-orange-600",
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
                                    key={item.key}
                                    className="flex items-center space-x-3 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      {...field}
                                      checked={checked}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`w-5 h-5 rounded border-2 ${checked ? item.color : "border-gray-500"} flex items-center justify-center`}
                                    >
                                      {checked && <Check className="w-3 h-3" />}
                                    </div>
                                    <span className="text-sm text-gray-300">
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
                  <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <label className=" flex items-center justify-start  text-sm font-medium text-slate-200 mb-2">
                      <Tag className="text-white" size={24} /> 商品標籤
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="輸入標籤名稱"
                          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-violet-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                          onKeyDown={(e) => e.key === "Enter" && addTag()}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addTag();
                          }}
                          className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(watch("product.hashTag") ?? "")
                          .split("#")
                          .filter((item) => item !== "")
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="group bg-gradient-to-r from-violet-600/80 to-purple-600/80 text-white px-3 py-2 rounded-xl text-sm flex items-center gap-2 backdrop-blur-sm border border-violet-500/30 hover:from-violet-500/80 hover:to-purple-500/80 transition-all duration-300"
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
            <div className="relative">
              {/* 背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-2xl"></div>

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Coffee className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">規格選項</h2>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
                        <p className="text-slate-300 text-sm">
                          設定不同規格與選項
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      append(defaultSpecInventories);
                      setActiveSpecIndex(fields.length);
                    }}
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    新增規格
                  </Button>
                </div>

                {/* 規格標籤列表 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {fields.map((field, index) => (
                    <Button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSpecIndex(index);
                      }}
                      className={`group relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeSpecIndex === index
                          ? "bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg"
                          : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {w_specInventories[index]?.spec || `規格 ${index + 1}`}
                      {fields.length > 1 && (
                        <div
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
                              }
                            );
                          }}
                          className="w-4 h-4 ml-auto bg-white/20 hover:bg-white/40 rounded-full 
                              flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <X className="w-2 h-2" />
                        </div>
                      )}
                    </Button>
                  ))}
                </div>

                {/* 當前規格設定 */}
                {fields[activeSpecIndex] && (
                  <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    {/* 價格設定 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
                          名稱 *
                        </label>
                        <input
                          key={activeSpecIndex}
                          type="text"
                          {...register(
                            `specInventories.${activeSpecIndex}.spec` as const
                          )}
                          placeholder="例：原味、草莓、巧克力"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-orange-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                        {errors.specInventories?.[activeSpecIndex]?.spec
                          ?.message && (
                          <p className=" mt-1 text-red-500 text-sm">
                            {
                              errors.specInventories?.[activeSpecIndex]?.spec
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                  cleaned
                                );
                              },
                            }
                          )}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-orange-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
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
                        <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                  cleaned
                                );
                              },
                            }
                          )}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-orange-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />

                        {errors.specInventories?.[activeSpecIndex]?.salePrice
                          ?.message && (
                          <p className=" mt-1 text-red-500 text-sm">
                            {
                              errors.specInventories?.[activeSpecIndex]
                                ?.salePrice.message
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                  cleaned
                                );
                              },
                            }
                          )}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-orange-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                        {errors.specInventories?.[activeSpecIndex]?.vipPrice
                          ?.message && (
                          <p className=" mt-1 text-red-500 text-sm">
                            {
                              errors.specInventories?.[activeSpecIndex]
                                ?.vipPrice.message
                            }
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                  cleaned
                                );
                              },
                            }
                          )}
                          placeholder="0"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-orange-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                        />
                        {errors.specInventories?.[activeSpecIndex]?.cost
                          ?.message && (
                          <p className=" mt-1 text-red-500 text-sm">
                            {
                              errors.specInventories?.[activeSpecIndex]?.cost
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
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
                                cleaned
                              );
                            },
                          }
                        )}
                        placeholder="0"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none focus:border-orange-400/80 focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                      />
                      {errors.specInventories?.[activeSpecIndex]?.stock
                        ?.message && (
                        <p className=" mt-1 text-red-500 text-sm">
                          {
                            errors.specInventories?.[activeSpecIndex]?.stock
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {/* 圖片上傳 */}
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        圖片
                      </label>
                      <label
                        htmlFor={`spec-image-${activeSpecIndex}`}
                        className="cursor-pointer"
                      >
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-orange-400/50 transition-all duration-300 cursor-pointer group bg-white/5 backdrop-blur-sm">
                          {isUploading ? (
                            <>
                              <p className="text-slate-400">上傳中...</p>
                            </>
                          ) : (
                            <>
                              {previews.get(activeSpecIndex.toString()) ? (
                                <div className="relative">
                                  <img
                                    src={
                                      previews.get(
                                        activeSpecIndex.toString()
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
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <Camera className="w-6 h-6 text-orange-400" />
                                  </div>
                                  <p className="text-slate-200 text-sm font-medium">
                                    點擊上傳圖片
                                  </p>
                                  <p className="text-slate-400 text-xs mt-1">
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
                      {errors.specInventories?.[activeSpecIndex]?.photoTemp
                        ?.message && (
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
}

export const NumericRatingInput: React.FC<NumericRatingInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 5,
  step = 0.5,
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
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 text-white placeholder-slate-300/50 rounded-full transition-colors duration-200"
        disabled={value <= min}
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        readOnly
        onChange={handleInputChange}
        className="w-20 cursor-default px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-300/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
      />
      <button
        type="button"
        onClick={increment}
        className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20 text-white placeholder-slate-300/50 rounded-full transition-colors duration-200 "
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};
