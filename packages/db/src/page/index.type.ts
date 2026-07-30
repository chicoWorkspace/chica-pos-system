import mongoose, { Document, Schema, Types } from "mongoose";

export interface PageAttributes {
  name: string;
  key: string;
  permissions: PermissionsAttributes[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionsAttributes {
  key: string; //權限代碼 create edit delete view...
  name: string;
  description: string;
}

export interface IPage extends Document, PageAttributes {
  _id: Types.ObjectId;
}

export interface IPermissions extends Document, PermissionsAttributes {}

export const tablePage = "page";

const PermissionSchema = new Schema<IPermissions>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
});

export const PageSchema: Schema = new Schema<IPage>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    permissions: [PermissionSchema],
     createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: tablePage,
    timestamps: true,
  }
);

export type LeanPage = Omit<IPage, keyof mongoose.Document> & {
  _id: Types.ObjectId | string; // 補上 _id
};

export interface PageAddParams {
  name: string;
  key: string;
  permissions: PermissionsAttributes[];
}

export interface PageGetParams extends Partial<PageAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface PageDeleteParams extends PageGetParams {}

export interface PageUpdateParams extends Partial<PageAttributes> {
  _id?: string;
}

export interface PageDeleteResult {
  count: number;
  data: IPage[];
}

export interface PageSearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}
