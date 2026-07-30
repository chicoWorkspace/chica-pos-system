import { CartResultData, ICart } from "@repo/db";
import { IPhoto, PhotoAttributes } from "@repo/db";
import {
  ISpecInventory,
  SpecInventoryAttributes,
} from "@repo/db";
import { Types } from "mongoose";
import { SpecInventoriesProps } from "../product/index.type";
import { paymentMethods } from "@repo/db";

export type CartsResult = ICart[];
export type CartResult = ICart;

export interface CartItem extends SpecInventoriesProps {
  quantity: number;
}

export interface CartTableResult {
  userId: Types.ObjectId;
  items: CartItem[];
}

export interface CartOrderParams {
  paymentMethod: paymentMethods;
}

export interface CartAddParams {
  specId: string;
  quantity: number;
}

export interface CartCreateParams {
  name: string;
  description?: string;
}

export interface CartAddMemberParams {
  username: string;
  password: string;
}

export interface CartUpdateParams {
  quantity: number;
}

export interface CartDeleteParams {
  specId: string;
}
