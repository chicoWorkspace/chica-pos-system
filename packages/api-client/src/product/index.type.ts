import { LeanPhoto, PhotoUpdateParams } from "@repo/db";
import {
  IProduct,
  LeanProduct,
  ProductUpdateParams,
} from "@repo/db";
import {
  LeanSpecInventory,
  SpecInventoryUpdateParams,
} from "@repo/db";
import { PhotoAddParams } from "../photo/index.type";
import { SpecInventoryAddParams } from "../spec-iInventory/index.type";
import { Types } from "mongoose";
import { LeanCategory } from "@repo/db";

export interface CreateProductRequest {
  product: ProductAddParams;
  specInventories: SpecInventoryAddParams[];
  photos?: PhotoAddParams[];
}

export interface UpdateProductRequest {
  product: ProductUpdateParams;
  specInventories: SpecInventoryUpdateParams[];
  photos?: PhotoUpdateParams[];
}

export interface ProductResult extends IProduct {}

export interface ProductAddParams {
  _id?: string;

  categoryUuid: string;
  categoryName: string;
  isShow: boolean;
  name: string;

  subtitle: string;
  description: string;
  hashTag?: string;
  is_new: boolean;
  isHot: boolean;
  isSpecialOffer: boolean;
  ratings: number;
  soldQty: number;

  startDate?: Date;
  endDate?: Date;
}

export interface ProductGetParams {
  _id?: string;
  name?: string;
  is_new?: boolean;
  isHot?: boolean;
  isSpecialOffer?: boolean;
}

export interface ProudctInListResult {
  product: ProductProps;
  specInventories: SpecInventoriesProps[];
  photos: PhotosProps[];
}

export interface ApiProudctInListResult {
  product: ProductProps;
  specInventories: ApiSpecInventoriesProps[];
  photos: PhotosProps[];
}

export interface ProductProps extends LeanProduct {}

export interface ApiSpecInventoriesProps extends LeanSpecInventory {}

export interface SpecInventoriesProps extends LeanSpecInventory {
  photo: PhotosProps | null;
  categoryName?: string;
  categoryUuid?: string;
}

export interface PhotosProps extends LeanPhoto {}

export interface CategoriesProps extends LeanCategory {}
