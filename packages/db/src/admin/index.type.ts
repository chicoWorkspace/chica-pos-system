import mongoose, { Document, Schema } from "mongoose";

export interface AdminAttributes {
  username: string; // 帳號
  password: string; // 加密後密碼
  isActive: boolean; // 是否啟用
  lastLogin?: Date; // 最後登入時間
  refreshToken: string; // 長效token
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminDocument  extends AdminAttributes {
  _id: mongoose.Types.ObjectId;
}

export const tableAdmin = "admin";

export interface IAdmin extends Document, AdminAttributes {}

export const AdminSchema: Schema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: { type: String, default: "" },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true, collection: tableAdmin }
);

export interface AdminAddParams {
  username: string; // 帳號
  password: string; // 加密後密碼
  isActive: boolean; // 是否啟用
}
export interface AdminGetParams extends Partial<AdminAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface AdminDeleteParams extends AdminGetParams {}

export interface AdminUpdateParams extends Partial<AdminAttributes> {
  _id?: string;
}

export interface AdminDeleteResult {
  count: number;
  data: IAdmin[];
}

export interface SearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}

const AdminModel = mongoose.model<IAdminDocument>(tableAdmin, AdminSchema);

export default AdminModel;
