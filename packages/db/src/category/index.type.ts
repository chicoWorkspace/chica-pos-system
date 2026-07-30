import mongoose, { Document, Schema, Types } from "mongoose";

export interface CategoryAttributes {
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document, CategoryAttributes {
  _id: Types.ObjectId;
}
export const tableCategory = "category";

export const CategorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: tableCategory,
    timestamps: true,
  }
);

// 建立索引
// 只建立索引一次
if (!CategorySchema.indexes().some((idx) => idx[0].name === 1)) {
  CategorySchema.index({ name: 1 });
}

export type LeanCategory = Omit<ICategory, keyof mongoose.Document> & {
  _id: Types.ObjectId | string; // 補上 _id
};

export interface CategoryAddParams {
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface CategoryGetParams extends Partial<CategoryAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface CategoryDeleteParams extends CategoryGetParams {}

export interface CategoryUpdateParams extends Partial<CategoryAttributes> {
  _id?: string;
}

export interface CategoryDeleteResult {
  count: number;
  data: ICategory[];
}

export interface CategorySearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}
