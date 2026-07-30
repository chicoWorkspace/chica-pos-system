import mongoose, { Document, Schema, Types } from "mongoose";
import { AdminAttributes, tableAdmin } from "../admin/index.type";
import {
  ISpecInventory,
  SpecInventoryAttributes,
  tableSpecInventory,
} from "../spec-inventory/index.type";
import { IPhoto } from "../photo/index.type";

export interface CartAttributes {
  userId: Types.ObjectId;
  items: ItemsAttributes[];
}
export interface ItemsAttributes {
  specId: Types.ObjectId;
  quantity: Number;
}

export interface IItems extends Document, ItemsAttributes {
  _id: Types.ObjectId;
}

export interface ICart extends Document, CartAttributes {
  _id: Types.ObjectId;
}

export const tableCart = "cart";

export const CartSchema: Schema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    items: [
      {
        specId: {
          type: Schema.Types.ObjectId,
          ref: tableSpecInventory,
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    collection: tableCart,
    timestamps: true,
  }
);

export type LeanCart = Omit<ICart, keyof mongoose.Document> & {
  _id: Types.ObjectId; // 補上 _id
};

export interface CartResultData extends Omit<ICart, "items"> {
  items: {
    specId: ISpecInventory;
    quantity: number;
  }[];
  photoes: IPhoto[];
}

export interface CartAddParams extends CartAttributes {}

export interface CartGetParams extends Omit<Partial<CartAttributes>, "userId"> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
  userId?:
    | Types.ObjectId
    | string
    | string[]
    | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface CartDeleteParams extends CartGetParams {}

export interface CartUpdateParams extends Partial<CartAttributes> {
  _id?: string;
}

export interface CartBulkUpdateParams {
  _id: string | mongoose.Types.ObjectId;
  updateData: CartUpdateParams;
}

export interface CartDeleteResult {
  count: number;
  data: ICart[];
}

export interface CartSearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}

// const CartModel = mongoose.model<ICart>(
//   tableCart,
//   CartSchema
// );

// export default CartModel;
