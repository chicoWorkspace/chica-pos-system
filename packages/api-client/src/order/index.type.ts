import {
  IOrder,
  ItemsAttributes,
  OrderAttributes,
  OrderCreaterParams,
  orderState,
  paymentMethods,
} from "@repo/db";
import { Types } from "mongoose";

export interface Base extends OrderAttributes {
  _id: Types.ObjectId;
}

export type OrdersResult = IOrder[];
export type OrderResult = IOrder;
export type OrderCreaterResult = Base;
export interface OrderCreaterBag extends OrderCreaterParams {}

export interface GetOrderRequest {
  orderId?: string;
  userId?: string;
  status?: orderState;
  createdAtFrom?: string; //new Date() 格式範例: 2026-04-17T08:30:00Z
  createdAtTo?: string; //new Date() 格式範例: 2026-04-17T08:30:00Z
}

export interface ProcessOrderPayload {
  userId: string;
  paymentMethod: paymentMethods;
  items: ItemsAttributes[];
  tipRate: number;
}
