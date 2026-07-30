import {
  actionValues,
  AnnoncType,
  AnnoncTypeValues,
} from "@repo/db";
import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";
import { StringUnion } from "../../utils/typebox";

export const AnnouncementGetParams = Type.Object({});

export const announcementQuerySchema = Type.Object({
  type: Type.Optional(
    Type.Unsafe<AnnoncType>(
      Type.String({
        enum: AnnoncTypeValues,
        description: "公告類型",
      }),
    ),
  ),
  isActive: Type.Optional(Type.Boolean({ description: "是否啟用" })),
  createdAtFrom: Type.Optional(
    Type.String({ format: "date-time", description: "開始時間（可選）" }),
  ),
  createdAtTo: Type.Optional(
    Type.String({ format: "date-time", description: "結束時間（可選）" }),
  ),
  // --- 新增排序欄位 ---
  sortBy: Type.Optional(
    Type.Union(
      [Type.Literal("createdAt"), Type.Literal("title"), Type.Literal("type")],
      { default: "createdAt", description: "排序欄位" },
    ),
  ),
  sortOrder: Type.Optional(
    Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
      default: "desc",
      description: "排序順序 (asc: 升序, desc: 降序)",
    }),
  ),
});
export type AnnouncementQuery = Static<typeof announcementQuerySchema>;

// 把陣列組合成 TypeBox 的 Union 類型
export const addAnnouncementSchema = Type.Object({
  title: Type.String({ minLength: 1, description: "公告標題" }),
  content: Type.String({ minLength: 1, description: "公告內容" }),

  // 使用工具函數對接你的 AnnoncTypeValues
  type: StringUnion(AnnoncTypeValues),

  // 彈性連結物件 (選填)
  link: Type.Optional(
    Type.Object({
      action: StringUnion(actionValues),
      url: Type.Optional(
        Type.String({  description: "跳轉網址" }),
      ),
      label: Type.Optional(Type.String({ description: "按鈕名稱" })),
      target: Type.Optional(
        Type.Union([Type.Literal("_blank"), Type.Literal("_self")], {
          default: "_self",
        }),
      ),
      // params 允許存放任何 Key-Value，所以用 Type.Record
      params: Type.Optional(
        Type.Record(Type.String(), Type.Any(), { description: "動態參數" }),
      ),
    }),
  ),
  isActive: Type.Boolean({ default: true, description: "是否啟用" }),
});

export type AddAnnouncementBody = Static<typeof addAnnouncementSchema>;
