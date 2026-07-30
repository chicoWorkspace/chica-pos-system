import mongoose, { Document, Schema, Types } from "mongoose";
import { AdminAttributes, tableAdmin } from "../admin/index.type";

export interface GroupAttributes {
  name: string;
  description: string;
  members: MemberAttributes[];
}
export interface MemberAttributes {
  userId: Types.ObjectId;
  role: string;
}

export interface IGroup extends Document, GroupAttributes {
  _id: Types.ObjectId;
}
export interface IMember extends Document, MemberAttributes {}

export const tableGroup = "group";

const MemberSchema = new Schema<IMember>({
  userId: { type: Schema.Types.ObjectId, ref: tableAdmin, required: true },
  role: { type: String, enum: ["leader", "member"], default: "member" },
});

export const GroupSchema: Schema = new Schema<IGroup>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    members: [MemberSchema],
  },
  {
    collection: tableGroup,
    timestamps: true,
  }
);

export type LeanGroup = Omit<IGroup, keyof mongoose.Document> & {
  _id: Types.ObjectId; // 補上 _id
};

export interface GroupResultData extends Omit<IGroup, "members"> {
  members: {
    userId: {
      _id: Types.ObjectId;
      username: string;
      isActive: boolean;
    };
    role: string;
  }[];
}

export interface GroupAddParams extends GroupAttributes {}

export interface GroupGetParams extends Partial<GroupAttributes> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface GroupDeleteParams extends GroupGetParams {}

export interface GroupUpdateParams extends Partial<GroupAttributes> {
  _id?: string;
}

export interface GroupBulkUpdateParams {
  _id: string | mongoose.Types.ObjectId;
  updateData: GroupUpdateParams;
}

export interface GroupDeleteResult {
  count: number;
  data: IGroup[];
}

export interface GroupSearchParams {
  filter: {
    user_name?: string;
    name?: string;
  };
}

// const GroupModel = mongoose.model<IGroup>(
//   tableGroup,
//   GroupSchema
// );

// export default GroupModel;
