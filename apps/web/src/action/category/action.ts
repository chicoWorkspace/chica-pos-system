"use server";

import { auth } from "@/lib/auth";
import { getCategoryApi } from "@/src/api-client/category";
import {
  CategoryAddParams,
  CategoryGetParams,
  CategoryResult,
  CategoryUpdateParams,
} from "@repo/api-client";

export interface ICategoryAction {
  get(params?: CategoryGetParams): Promise<CategoryResult | undefined>;
  create(params: CategoryAddParams): Promise<CategoryResult | undefined>;
  update(
    id: string,
    params: CategoryUpdateParams
  ): Promise<CategoryResult | undefined>;
  deleteCategory(id: string): Promise<CategoryResult | undefined>;
}

/**
 * 用於 Category 的伺服端動作集合
 * 可於任何元件中傳入或使用
 * 例如：const { getCategoryList } = categoryActions;
 */
export async function get(params: CategoryGetParams) {
  const { api, accessToken } = await setup();
  return await api.get(accessToken, params ?? {});
}

export async function create(params: CategoryAddParams) {
  const { api, accessToken } = await setup();
  return await api.create(accessToken, params);
}

export async function update(id: string, params: CategoryUpdateParams) {
  const { api, accessToken } = await setup();
  return await api.update(accessToken, id, params);
}

export async function deleteCategory(id: string) {
  const { api, accessToken } = await setup();
  return await api.delete(accessToken, id);
}

export async function setup() {
  const session = await auth();
  const api = await getCategoryApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
