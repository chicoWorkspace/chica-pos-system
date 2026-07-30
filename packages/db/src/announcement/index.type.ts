import mongoose, { Document, Schema, Types } from "mongoose";

// annoncType 的 enum 定義
export const AnnoncTypeValues = [
  "success",
  "warning",
  "info",
  "critical",
] as const;
export type AnnoncType = (typeof AnnoncTypeValues)[number]; // 遍歷陣列 "success" | "warning" | "info" | "critical"

//action 的 enum 定義
export const actionValues = [
  "external",
  "internal_route",
  //前端畫面路徑
  "analytics",
  "product",
  "purchase_history",
  "none",
] as const;
export type AnnoncLinkAction = (typeof actionValues)[number];

// 定義連結的具體結構
export interface AnnouncementLink {
  action: AnnoncLinkAction;
  url?: string; // 適用於 external 或 internal_route
  label?: string; // 按鈕顯示文字
  target?: "_blank" | "_self";
  params?: Record<string, any>; // 存放 orderId, productId 等
}

export interface AnnouncementAttributes {
  title: string;
  content: string;
  type: AnnoncType;
  link?: AnnouncementLink; // 彈性連結物件
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnnouncement extends Document, AnnouncementAttributes {
  _id: Types.ObjectId;
}

export const tableAnnouncement = "announcement";

export const AnnouncementSchema: Schema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: AnnoncTypeValues, // ["success", "warning", "info", "critical"]
      default: "info",
    },
    // 彈性連結設計
    link: {
      action: {
        type: String,
        enum: actionValues, // ["external", "internal_route", "order_detail", "inventory_item", "none"]
        default: "none",
      },
      url: { type: String, default: "" },
      label: { type: String, default: "" },
      target: { type: String, default: "_self" },
      params: { type: Schema.Types.Mixed, default: {} }, // 使用 Mixed 存放任意 Key-Value
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: tableAnnouncement,
    timestamps: true,
  },
);

export type LeanAnnouncement = Omit<IAnnouncement, keyof mongoose.Document> & {
  _id: Types.ObjectId | string;
};

// 用於新增公告
export interface AnnouncementAddParams {
  title: string;
  content: string;
  type: AnnoncType;
  link?: AnnouncementLink;
  isActive?: boolean;
}

// 用於查詢與過濾
export interface AnnouncementGetParams extends Partial<AnnouncementAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface AnnouncementDeleteParams extends AnnouncementGetParams {}

export interface AnnouncementDeleteResult {
  count: number;
  data: IAnnouncement[];
}

export interface AnnouncementUpdateParams
  extends Partial<AnnouncementAddParams> {
  _id: string;
}
