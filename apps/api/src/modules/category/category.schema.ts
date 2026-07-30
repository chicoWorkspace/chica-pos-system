// apps/api/src/features/category/category.schema.ts
import { Type, Static } from "@sinclair/typebox";

// GET /category query
export const categoryQuerySchema = Type.Object({
  id: Type.Optional(
    Type.String({
      description: "分類 ID",
    })
  ),
  name: Type.Optional(
    Type.String({
      description: "分類名稱",
    })
  ),
});
export type CategoryQuery = Static<typeof categoryQuerySchema>;

// POST /category body
export const categoryBodySchema = Type.Object({
  name: Type.String(),
  icon: Type.String(),
  order: Type.Optional(Type.Number()),
  isActive: Type.Optional(Type.Boolean()),
});
export type CategoryCreate = Static<typeof categoryBodySchema>;

// PATCH /category/:id body
export const categoryUpdateSchema = Type.Object({
  name: Type.Optional(Type.String()),
  icon: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});
export type CategoryUpdate = Static<typeof categoryUpdateSchema>;

// params schema for routes with :id
export const categoryIdParamSchema = Type.Object({
  id: Type.String(),
});
export type CategoryIdParam = Static<typeof categoryIdParamSchema>;
