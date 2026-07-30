import { CategoryAttributes, ICategory } from "@repo/db";

interface Base extends CategoryAttributes {
  _id: string; // 前端直接用 string
  count?: number; // 商品數量
}
export type CategoryResult = Base[];




export interface CategoryGetParams {
  name?: string;
  id?: string;
}

export interface CategoryAddParams {
  name: string;
  icon: string;
  order?: number;
  isActive?: boolean;
}

export interface CategoryUpdateParams {
  name?: string;
  icon?: string;
  isActive?: boolean;
}