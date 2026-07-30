"use server";

import { auth } from "@/lib/auth";
import { getGroupPermissionApi } from "@/src/api-client/group-permission";
import {
  GroupPermissionCreateParams,
  GroupPermissionResult,
  GroupPermissionsGetParams,
  GroupPermissionsResult,
  TogglePermissionParams,
} from "@repo/api-client";

export interface IGroupPermissionAction {
  getGroupPermissions(
    params: GroupPermissionsGetParams
  ): Promise<GroupPermissionsResult | undefined>;
  create(
    params: GroupPermissionCreateParams
  ): Promise<GroupPermissionResult | undefined>;
  updatePermissionToggle(
    params: TogglePermissionParams
  ): Promise<GroupPermissionResult | undefined>;
}

/**
 * GroupPermissionAction
 * 封裝所有 GroupPermission 相關的 server action
 */
export async function getGroupPermissions(params: GroupPermissionsGetParams) {
  const { api, accessToken } = await setup();
  return await api.getGroupPermissions(accessToken, params ?? {});
}

export async function create(params: GroupPermissionCreateParams) {
  const { api, accessToken } = await setup();
  return await api.create(accessToken, params);
}

export async function updatePermissionToggle(
  params: TogglePermissionParams
) {
  const { api, accessToken } = await setup();
  return await api.updatePermissionToggle(accessToken, params);
}

export async function setup() {
  const session = await auth();
  const api = await getGroupPermissionApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
