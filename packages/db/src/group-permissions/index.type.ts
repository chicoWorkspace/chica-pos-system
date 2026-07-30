import mongoose, { Document, Schema, Types } from "mongoose";
import { tableGroup } from "../group/index.type";
import { tablePage } from "../page/index.type";

export interface GroupPermissionsAttributes {
  groupId: Types.ObjectId;
  pageId: Types.ObjectId;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupPermissions
  extends Document,
    GroupPermissionsAttributes {
  _id: Types.ObjectId;
}

export const tableGroupPermissions = "group-permissions";

export const GroupPermissionsSchema: Schema = new Schema<IGroupPermissions>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: tableGroup, required: true },
    pageId: { type: Schema.Types.ObjectId, ref: tablePage, required: true },
    permissions: [String],
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: tableGroupPermissions,
    timestamps: true,
  }
);

export type LeanGroupPermissions = Omit<
  IGroupPermissions,
  keyof mongoose.Document
> & {
  _id: Types.ObjectId | string; // 補上 _id
};

export interface GroupPermissionsAddParams {
  groupId: string;
  pageId: string;
  permissions?: string[];
}

export interface GroupPermissionsGetParams {
  groupId?: string;
  pageId?: string;
}

export interface GroupPermissionsDeleteParams
  extends GroupPermissionsGetParams {}

export interface GroupPermissionsUpdateParams
  extends Partial<GroupPermissionsAttributes> {
  _id?: string;
}

export interface GroupPermissionsDeleteResult {
  count: number;
  data: IGroupPermissions[];
}

export interface GroupPermissionsSearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}
