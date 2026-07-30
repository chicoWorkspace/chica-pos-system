"use server";

import { auth } from "@/lib/auth";
import { getGroupApi } from "@/src/api-client/group";
import {
  GroupAddMemberParams,
  GroupCreateParams,
  GroupGetParams,
  GroupUpdateParams,
  GroupResult,
  GroupsResult,
} from "@repo/api-client";

export interface IGroupAction {
  getGroups(): Promise<GroupsResult | undefined>;
  create(params: GroupCreateParams): Promise<GroupResult | undefined>;
  update(
    groupId: string,
    params: GroupUpdateParams
  ): Promise<GroupResult | undefined>;
  deleteGroup(groupId: string): Promise<GroupResult | undefined>;
  addMember(
    groupId: string,
    params: GroupAddMemberParams
  ): Promise<GroupResult | undefined>;
  deleteMember(
    groupId: string,
    adminId: string
  ): Promise<GroupResult | undefined>;
  setMemberAsLeader(
    groupId: string,
    adminId: string
  ): Promise<GroupResult | undefined>;
}




/**
 * GroupAction
 * 封裝所有 group 相關的 server action
 */
export async function getGroups() {
  const { api, accessToken } = await setup();
  return await api.getGroups(accessToken);
}

export async function create(params: GroupCreateParams) {
  const { api, accessToken } = await setup();
  return await api.create(accessToken, params);
}

export async function update(groupId: string, params: GroupUpdateParams) {
  const { api, accessToken } = await setup();
  return await api.update(accessToken, groupId, params);
}

export async function deleteGroup(groupId: string) {
  const { api, accessToken } = await setup();
  return await api.delete(accessToken, groupId);
}

export async function addMember(groupId: string, params: GroupAddMemberParams) {
  const { api, accessToken } = await setup();
  return await api.addMember(accessToken, groupId, params);
}

export async function deleteMember(groupId: string, adminId: string) {
  const { api, accessToken } = await setup();
  return await api.deleteMember(accessToken, groupId, adminId);
}

export async function setMemberAsLeader(groupId: string, adminId: string) {
  const { api, accessToken } = await setup();
  return await api.setMemberAsLeader(accessToken, groupId, adminId);
}

export async function setup() {
  const session = await auth();
  const api = await getGroupApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}

