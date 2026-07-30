import { LeanGroupPermissions } from "@repo/db";

export type GroupPermissionsResult = LeanGroupPermissions[];
export type GroupPermissionResult = LeanGroupPermissions;

export interface GroupPermissionsGetParams {
  groupId?: string;
  pageId?: string;
}

export interface GroupPermissionCreateParams {
  name: string;
  description?: string;
}

export interface GroupPermissionAddMemberParams {
  username: string;
  password: string;
}

export interface GroupPermissionUpdateParams {
  name: string;
  description?: string;
}

export interface TogglePermissionParams {
  groupId: string;
  pageId: string;
  permissionKey: string;
}
