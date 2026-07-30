import mongoose, { Document, Schema, Types } from "mongoose";
import { AdminAttributes, tableAdmin } from "../admin/index.type";
import {
  ISpecInventory,
  SpecInventoryAttributes,
  tableSpecInventory,
} from "../spec-inventory/index.type";
import { IPhoto } from "../photo/index.type";
import { tableProduct } from "../product/index.type";
import { ItemsAttributes } from "../cart/index.type";

export interface OrderAttributes {
  orderNumber: string;
  items: OrderItemAttributes[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: orderState;
  payment: {
    method: paymentMethods;
    paidAt?: Date;
  };
  staff: {
    userId: Types.ObjectId;
    username: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export type orderState = "pending" | "paid" | "cancelled";
export type paymentMethods = "cash" | "credit" | "linepay";

export interface OrderItemAttributes {
  specId: Types.ObjectId;
  productId: Types.ObjectId;
  snapshot: {
    name: string;
    categoryUuid: Types.ObjectId;
    categoryName: string;
    photo?: IPhoto;
    price: number;
  };
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document, OrderAttributes {
  _id: Types.ObjectId;
}

export interface IOrderItem extends Document, OrderItemAttributes {
  _id: Types.ObjectId;
}

export const tableOrder = "order";

export const OrderItemSchema: Schema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: tableProduct,
    required: true,
  },
  specId: {
    type: Schema.Types.ObjectId,
    ref: tableSpecInventory,
    required: true,
  },

  // 商品快照
  snapshot: {
    name: { type: String, required: true },
    categoryName: { type: String, default: "" },
    categoryUuid: { type: Schema.Types.ObjectId, default: "" },
    photo: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
    price: { type: Number, required: true },
  },

  // 數量與小計
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

export const OrderSchema: Schema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    items: [OrderItemSchema],

    //  訂單金額資訊
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },

    // 狀態流程
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
      index: true,
    },

    // 付款紀錄
    payment: {
      method: {
        type: String,
        enum: ["cash", "credit", "linepay"],
        default: "cash",
      },
      paidAt: { type: Date },
    },

    // 處理訂單的員工
    staff: {
      userId: { type: Schema.Types.ObjectId, ref: tableAdmin, required: true },
      username: { type: String, required: true },
    },

    // 系統紀錄
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: tableOrder, timestamps: true },
);

export type LeanOrder = Omit<IOrder, keyof mongoose.Document> & {
  _id: Types.ObjectId; // 補上 _id
};

export interface OrderResultData extends Omit<IOrder, "items"> {
  items: {
    specId: ISpecInventory;
    quantity: number;
  }[];
  photoes: IPhoto[];
}

export interface OrderCreaterParams {
  orderNumber: string;
  userId: string;
  paymentMethod: paymentMethods;
  items: ItemsAttributes[];
  tipRate: number; // 小費費率
}

export interface OrderAddParams extends OrderAttributes {}

export interface OrderGetParams
  extends Omit<Partial<OrderAttributes>, "userId"> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
  userId?:
    | Types.ObjectId
    | string
    | string[]
    | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface OrderDeleteParams extends OrderGetParams {}

export interface OrderUpdateParams extends Partial<OrderAttributes> {
  _id?: string;
}

export interface OrderBulkUpdateParams {
  _id: string | mongoose.Types.ObjectId;
  updateData: OrderUpdateParams;
}

export interface OrderDeleteResult {
  count: number;
  data: IOrder[];
}

export interface OrderSearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}

// const OrderModel = mongoose.model<IOrder>(
//   tableOrder,
//   OrderSchema
// );

// export default OrderModel;
