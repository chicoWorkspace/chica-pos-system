"use server";

import { auth } from "@/lib/auth";
import { getAnnouncementApi } from "@/src/api-client/announcement";
import {
  AnnouncementAddParams,
  AnnouncementGetParams,
  AnnouncementLinkType,
  AnnouncementResult,
} from "@repo/api-client";

export interface IAnnouncementAction {
  get(params?: AnnouncementGetParams): Promise<AnnouncementResult | undefined>;
  create(params: AnnouncementAddParams): Promise<AnnouncementResult | undefined>;
 
}

/**
 * 用於 announcement 的伺服端動作集合
 * 可於任何元件中傳入或使用
 * 例如：const { getAnnouncementList } = categoryActions;
 */
export async function get(params: AnnouncementGetParams) {
  const { api, accessToken } = await setup();
  return await api.get(accessToken, params ?? {});
}

export async function create(params: AnnouncementAddParams) {
  const { api, accessToken } = await setup();
  return await api.create(accessToken, params);
}



export async function setup() {
  const session = await auth();
  const api = await getAnnouncementApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}


