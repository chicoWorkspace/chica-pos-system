import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelPhoto } from "./index.model";
import {
  PhotoAddParams,
  PhotoDeleteParams,
  PhotoGetParams,
  PhotoUpdateParams,
  IPhoto,
  PhotoDeleteResult,
} from "./index.type";

export class Photo {
  /**
   * 新增
   * @param {PhotoAddParams} params - 新參數
   * @returns {Promise<ModelPhoto>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: PhotoAddParams): Promise<ModelPhoto> {
    return await ModelPhoto.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {PhotoGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IPhoto>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: PhotoGetParams): Promise<IPhoto> {
    const info = await ModelPhoto.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  /**
   * 根據給定參數查找信息
   * @param {PhotoGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IPhoto[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: PhotoGetParams,
    sort?: { [key: string]: SortOrder }
  ): Promise<IPhoto[]> {
    const list = await ModelPhoto.getData(params, sort);
    return list;
  }

  /**
   * 編輯
   * @param {PhotoUpdateParams} filterParams - 用於篩選的參數
   * @param {PhotoUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPhoto>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<PhotoUpdateParams>,
    updateParams: PhotoUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPhoto> {
    return await ModelPhoto.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {PhotoDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPhoto>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<PhotoDeleteParams>,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPhoto> {
    return await ModelPhoto.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {PhotoDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<PhotoDeleteResult>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteMany(
    params: PhotoDeleteParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<PhotoDeleteResult> {
    return await ModelPhoto.deleteMany(params, session);
  }
}
