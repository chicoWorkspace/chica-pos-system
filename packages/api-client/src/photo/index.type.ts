import { Types } from "mongoose";

export interface PhotoAddParams {
  _id?: Types.ObjectId;

  filename: string;
  rank?: number;
  alt?: string;
}
