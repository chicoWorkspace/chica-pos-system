import { Type, Static } from "@sinclair/typebox";

// 下訂單 schema
export const orderSchema = Type.Object(
  {
    paymentMethod: Type.String({
      description: "付款方式，可選: 'cash', 'credit', 'linepay'",
      enum: ["cash", "credit", "linepay"],
    }),
  },
  { additionalProperties: false }
);
export type OrderBody = Static<typeof orderSchema>;

// 更新購物車 schema
export const updateCartSchema = Type.Object(
  {
    quantity: Type.Number({ minimum: 0 }),
  },
  { additionalProperties: false }
);
export type UpdateCartBody = Static<typeof updateCartSchema>;

// params schema for specId
export const specIdParamSchema = Type.Object(
  {
    specId: Type.String({
      description: "商品規格 ID",
    }),
  },
  { additionalProperties: false }
);
export type SpecIdParam = Static<typeof specIdParamSchema>;
