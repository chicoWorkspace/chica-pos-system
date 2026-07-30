import { Type } from "@sinclair/typebox";
import {
  ProductAddParams,
  ProductUpdateParams,
} from "@repo/db";
import {
  SpecInventoryAddParams,
  SpecInventoryUpdateParams,
} from "@repo/db";
import { PhotoAddParams, PhotoUpdateParams } from "@repo/db";

// SpecInventory schema
export const SpecInventorySchema = Type.Object({
  _id: Type.Optional(Type.String()),
  spec: Type.String(),
  originalPrice: Type.Number(),
  salePrice: Type.Number(),
  vipPrice: Type.Number(),
  stock: Type.Number(),
  cost: Type.Number(),
  name: Type.String(),
});

// Photo schema
export const PhotoSchema = Type.Object({
  _id: Type.Optional(Type.String()),
  productUuid: Type.String(),
  specUuid: Type.String(),
  filename: Type.String(),
  rank: Type.Number(),
  alt: Type.Optional(Type.String()),
});

//create Photo schema
export const CreatePhotoSchema = Type.Object({
  filename: Type.String(),
  alt: Type.Optional(Type.String()),
});


// Product schema
export const ProductSchema = Type.Object({
  _id: Type.Optional(Type.String()),
  categoryUuid: Type.String(),
  categoryName: Type.String(),
  isShow: Type.Boolean(),
  name: Type.String(),
  subtitle: Type.String(),
  description: Type.String(),
  hashTag: Type.Optional(Type.String()),
  is_new: Type.Boolean(),
  isHot: Type.Boolean(),
  isSpecialOffer: Type.Boolean(),
  ratings: Type.Number(),
  soldQty: Type.Number(),
  startDate: Type.Optional(Type.String({ format: "date-time" })),
  endDate: Type.Optional(Type.String({ format: "date-time" })),
});

// Request schemas
export const CreateProductSchema = Type.Object({
  product: ProductSchema,
  specInventories: Type.Array(SpecInventorySchema, { minItems: 1 }),
  photos: Type.Optional(Type.Array(CreatePhotoSchema)),
});



export const UpdateProductSchema = Type.Object({
  product: ProductSchema,
  specInventories: Type.Array(SpecInventorySchema, { minItems: 1 }),
  photos: Type.Array(PhotoSchema, { minItems: 1 }),
});

// TypeScript types
export type CreateProductRequest = {
  product: ProductAddParams;
  specInventories: SpecInventoryAddParams[];
  photos?: PhotoAddParams[];
};

export type UpdateProductRequest = {
  product: ProductUpdateParams;
  specInventories: SpecInventoryUpdateParams[];
  photos?: PhotoUpdateParams[];
};
