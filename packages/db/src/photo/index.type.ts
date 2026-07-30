import mongoose, { Document, Schema, Types } from "mongoose";

export interface PhotoAttributes {
  productUuid: Types.ObjectId;
  specUuid: Types.ObjectId;
  filename: string;
  rank: number;
  alt?: string;
}
export interface IPhoto extends Document, PhotoAttributes {
  _id: Types.ObjectId;
}
export const tablePhoto = "photo";

export const PhotoSchema: Schema = new Schema<IPhoto>(
  {
    productUuid: { type: Schema.Types.ObjectId, required: true, index: true }, //product集合的uuid
    specUuid: { type: Schema.Types.ObjectId, required: true, index: true }, //specInventory集合的uuid
    filename: { type: String, default: "" },
    rank: { type: Number, default: 0 },
    alt: { type: String, required: "" },
  },
  {
    collection: tablePhoto,
    timestamps: true,
  }
);

// product_uuid做複合索引
PhotoSchema.index({ product_uuid: 1, rank: 1 });

export type LeanPhoto = Omit<IPhoto, keyof mongoose.Document> & {
  _id: Types.ObjectId; // 補上 _id
};

export interface PhotoAddParams extends PhotoAttributes {}

export interface PhotoGetParams extends Omit<Partial<PhotoAttributes>, 'specUuid'> {
  _id?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
  specUuid?: string | string[] | { $in: (string | mongoose.mongo.BSON.ObjectId)[] };
}

export interface PhotoDeleteParams extends PhotoGetParams {}

export interface PhotoUpdateParams extends Partial<PhotoAttributes> {
  _id?: string;
  mark?: string;
}

export interface PhotoBulkUpdateParams {
  _id: string | mongoose.Types.ObjectId;
  updateData: PhotoUpdateParams;
}

export interface PhotoDeleteResult {
  count: number;
  data: IPhoto[];
}
