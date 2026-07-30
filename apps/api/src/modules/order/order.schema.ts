import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";

export const OrderGetParams = Type.Object({});

export const orderQuerySchema = Type.Object({
  orderId: Type.Optional(Type.String({ description: "訂單ID（可選）" })),
  userId: Type.Optional(Type.String({ description: "客戶名稱（可選）" })),
  status: Type.Optional(Type.String({ description: "訂單狀態（可選）" })),
  createdAtFrom: Type.Optional(
    Type.String({ format: "date-time", description: "開始時間（可選）格式範例: 2026-04-17T08:30:00Z" }),
  ),
  createdAtTo: Type.Optional(
    Type.String({ format: "date-time", description: "結束時間（可選）格式範例: 2026-04-17T08:30:00Z" }),
  ),
});
export type OrderQuery = Static<typeof orderQuerySchema>;
