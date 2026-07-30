import mongoose, { Document, Schema, Types } from "mongoose";
import { LeanSpecInventory } from "../spec-inventory/index.type";
import { LeanPhoto } from "../photo/index.type";

export interface ProductAttributes {
  categoryUuid: Types.ObjectId;
  categoryName: string;

  isShown?: boolean;
  name: string;
  subtitle?: string;
  description?: string;
  coverPhoto?: string;
  hashTag?: string;
  is_new?: boolean; 
  isHot?: boolean;
  isSpecialOffer?: boolean;
  ratings?: number;
  soldQty?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct extends Document, ProductAttributes {
  _id: Types.ObjectId;
}
export const tableProduct = "product";

export const ProductSchema: Schema = new Schema<IProduct>(
  {
    categoryUuid: { type: Schema.Types.ObjectId, required: true, index: true },
    categoryName: { type: String, required: true },
    isShown: { type: Boolean, default: true, index: true },
    name: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    hashTag: { type: String, default: "" },
    is_new: { type: Boolean, default: false },
    isHot: { type: Boolean, default: false },
    isSpecialOffer: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    soldQty: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: tableProduct,
    timestamps: true,
  }
);

export type LeanProduct = Omit<IProduct, keyof mongoose.Document> & {
  _id: Types.ObjectId | string; // 補上 _id
};

export interface ProductInList {
  product: LeanProduct;
  specInventories: LeanSpecInventory[];
  photos: LeanPhoto[];
}

export interface ProductAddParams extends ProductAttributes {}

export interface ProductGetParams extends Partial<ProductAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface ProductDeleteParams extends ProductGetParams {}

export interface ProductUpdateParams
  extends Partial<Omit<ProductAttributes, "categoryUuid">> {
  _id?: string;
  categoryUuid?: string;
}

export interface ProductDeleteResult {
  count: number;
  data: IProduct[];
}

export interface ProductSearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}
