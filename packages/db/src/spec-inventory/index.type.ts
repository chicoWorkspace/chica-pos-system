import mongoose, { Document, Schema, Types } from "mongoose";

export interface SpecInventoryAttributes {
  productUuid: Types.ObjectId;
  spec: string;
  rank?: number;
  originalPrice: number;
  salePrice: number;
  stock: number;
  cost: number;
  vipPrice: number;
  name: string;
}
export interface ISpecInventory extends Document, SpecInventoryAttributes {
  _id: Types.ObjectId;
}
export const tableSpecInventory = "spec_inventory";

export const SpecInventorySchema: Schema = new Schema<ISpecInventory>(
  {
    productUuid: { type: Schema.Types.ObjectId, required: true, index: true }, //product集合的uuid
    spec: { type: String, required: true },
    rank: { type: Number, default: 0 },
    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    stock: { type: Number, default: 0, required: true },
    cost: { type: Number, default: 0, required: true },
    vipPrice: { type: Number, default: 0, required: true },
    name: { type: String, required: true },
  },
  {
    collection: tableSpecInventory,
    timestamps: true,
  }
);

// product_uuid做複合索引
SpecInventorySchema.index({ product_uuid: 1, rank: 1 });

export type LeanSpecInventory = Omit<
  ISpecInventory,
  keyof mongoose.Document
> & {
  _id: Types.ObjectId; // 補上 _id
};

export interface SpecInventoryAddParams {
  productUuid: Types.ObjectId;
  spec: string;
  rank?: number;
  photo?: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  cost: number;
  vipPrice: number;
  name: string;
}

export interface SpecInventoryGetParams
  extends Partial<SpecInventoryAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface SpecInventoryDeleteParams extends SpecInventoryGetParams {}

export interface SpecInventoryUpdateParams
  extends Partial<SpecInventoryAttributes> {
  _id?: string;
  mark?:string;
}

export interface SpecInventoryBulkUpdateParams {
  _id: string | mongoose.Types.ObjectId;
  updateData: SpecInventoryUpdateParams;
}

export interface SpecInventoryDeleteResult {
  count: number;
  data: ISpecInventory[];
}


export interface SpecInventoryBulkUpdateCustomParams {
    filter: Record<string, any>;
    updateData: Record<string, any>
}