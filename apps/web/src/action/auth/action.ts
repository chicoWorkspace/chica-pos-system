"use server";

import { auth } from "@/lib/auth";
import { getAuthApi } from "@/src/api-client/auth";
import { GetPermissionsResult } from "@repo/api-client";

export interface IAuthAction {
  getPermissions(): Promise<GetPermissionsResult | undefined>;
}

/**
 * 用於 Auth 的伺服端動作集合
 * 可於任何元件中傳入或使用
 * 例如：const { getAuthList } = authActions;
 */
export async function getPermissions() {
  const { api, accessToken } = await setup();
  return await api.getPermissions(accessToken);
}

export async function setup() {
  const session = await auth();
  const api = await getAuthApi();
  const accessToken = session?.accessToken ?? "";
  
  return { api, accessToken };
}
