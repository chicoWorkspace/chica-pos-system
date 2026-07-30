import { LeanPage, PermissionsAttributes } from "@repo/db";

export type PageKeyTpye =
  | "order"
  | "product"
  | "purchase-history"
  | "analytics"
  | "setting";

export type PagesResult = LeanPage[];
export type PageResult = LeanPage;

export interface PagesGetParams {
  key?: string;
  name?: string;
}

export interface PageCreateParams {
  key: string;
  name: string;
}

export interface PageAddMemberParams {
  username: string;
  password: string;
}

export interface PageUpdateParams {
  name: string;
  description?: string;
}

export interface PermissionsParams extends PermissionsAttributes {
  _id?: string;
}
