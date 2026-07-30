import { ISpecInventory } from "@repo/db";
import { PhotosProps } from "../product/index.type";

export interface SpecInventoryAddParams {
  _id?: string;

  spec: string;
  rank?: number;
  photo?: PhotosProps | null;
  photoTemp: string;
  originalPrice: number;
  salePrice: number;
  stock: number;
  cost: number;
  vipPrice: number;
  name: string;
}

export interface SpecInventoryResult extends ISpecInventory {}
