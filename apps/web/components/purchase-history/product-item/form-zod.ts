import { ProductAddParams } from "@repo/api-client";
import { SpecInventoryAddParams } from "@repo/api-client";
import { addDays } from "date-fns";
import z from "zod";

export const productSchema = z
  .object({
    _id: z.string().optional(),
    categoryName: z.string().min(1, { message: "分類名稱不可為空" }),
    categoryUuid: z.string().min(1, { message: "分類名稱不可為空" }),
    isShow: z.boolean(),
    name: z.string().min(1, { message: "商品名稱不可為空" }),
    subtitle: z.string().min(1, { message: "副標題不可為空" }),
    description: z.string().min(1, { message: "描述不可為空" }),
    hashTag: z.string().min(1),
    ratings: z
      .number()
      .min(0, "數量不能小於 0")
      .max(5, "數量不能大於 5")
      .refine(
        (val) => val * 2 === Math.floor(val * 2),
        "數量必須是 0.5 的倍數"
      ),
    is_new: z.boolean(),
    isHot: z.boolean(),
    isSpecialOffer: z.boolean(),
    soldQty: z.number().int().nonnegative(),
    startDate: z.date({
      message: "請選擇上架時間",
    }),
    endDate: z.date({
      message: "請選擇下架時間",
    }),
  })
  .refine((data) => !data.endDate || data.startDate <= data.endDate, {
    message: "下架時間不能早於上架時間",
    path: ["end_date"], // 錯誤訊息綁定到 end_date
  });

export const defaultProduct: ProductAddParams = {
  categoryUuid: "",
  categoryName: "",
  isShow: false,
  name: "",
  subtitle: "",
  description: "",
  hashTag: "",
  ratings: 5,
  is_new: false,
  isHot: false,
  isSpecialOffer: false,
  soldQty: 0,
  startDate: new Date(),
  endDate: addDays(new Date(), 1),
};

export const photoSchema = z.object({
  url: z.string().optional(),
  alt: z.string().nullable().optional(),
});
export const specInventoriesSchema = z
  .object({
    _id: z.string().optional(),
    spec: z.string().min(1, "規格必填"),
    // photo: z
    //   .any()
    //   .nullable()
    //   .refine((file) => !file || file instanceof File, "請上傳檔案"),
    photoTemp: z.string().min(1, "請上傳圖片"),
    originalPrice: z.number().nonnegative("原價需大於等於 0"),
    salePrice: z.number().nonnegative("售價需大於等於 0"),
    stock: z.number().int().nonnegative("存貨必須 >= 0"),
    cost: z.number().nonnegative("成本需大於等於 0"),
    vipPrice: z.number().nonnegative("VIP 價需大於等於 0"),
  })
  .refine(
    (data) => !data.originalPrice || data.originalPrice >= data.salePrice,
    {
      message: "促銷價不能大於原價",
      path: ["sale_price"], // 錯誤訊息綁定到 endDate
    }
  );

export const defaultSpecInventories: SpecInventoryAddParams = {
  spec: "",
  photo: null,
  photoTemp: "",
  originalPrice: 0,
  salePrice: 0,
  stock: 0,
  cost: 0,
  vipPrice: 0,
  name: "",
};
