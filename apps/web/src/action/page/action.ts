"use server";

import { auth } from "@/lib/auth";
import { getPageApi } from "@/src/api-client/page";
import {
  PageCreateParams,
  PageResult,
  PagesGetParams,
  PagesResult,
} from "@repo/api-client";

export interface IPageAction {
  getPages(
    params: PagesGetParams
  ): Promise<PagesResult | undefined>;
  create(
    params: PageCreateParams
  ): Promise<PageResult | undefined>;
}

/**
 * PageAction
 * 封裝所有 Page 相關的 server action
 */
export async function getPages(params: PagesGetParams) {
  const { api, accessToken } = await setup();
  return await api.getPages(accessToken, params ?? {});
}

export async function create(params: PageCreateParams) {
  const { api, accessToken } = await setup();
  return await api.create(accessToken, params);
}

export async function setup() {
  const session = await auth();
  const api = await getPageApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
