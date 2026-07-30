import { GroupResultData } from "@repo/db";

export type GroupsResult = GroupResultData[];
export type GroupResult = GroupResultData;

export interface GroupGetParams {
  name?: string;
  id?: string;
}

export interface GroupCreateParams {
  name: string;
  description?: string;
}

export interface GroupAddMemberParams {
  username: string;
  password: string;
}

export interface GroupUpdateParams {
  name: string;
  description?: string;
}
