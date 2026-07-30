import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelSpecInventory } from "./index.model";
import {
  SpecInventoryAddParams,
  SpecInventoryDeleteParams,
  SpecInventoryGetParams,
  SpecInventoryUpdateParams,
  ISpecInventory,
  SpecInventoryDeleteResult,
} from "./index.type";

export class SpecInventory {
  /**
   * 新增
   * @param {SpecInventoryAddParams} params - 新參數
   * @returns {Promise<ModelSpecInventory>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(
    params: SpecInventoryAddParams
  ): Promise<ModelSpecInventory> {
    //插入資料時要轉成ObjectId
    //product_uuid: new mongoose.Types.ObjectId("64f1a2...")

    return await ModelSpecInventory.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {SpecInventoryGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<ISpecInventory>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: SpecInventoryGetParams): Promise<ISpecInventory> {
    const info = await ModelSpecInventory.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  /**
   * 根據給定參數查找信息
   * @param {SpecInventoryGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<ISpecInventory[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: SpecInventoryGetParams,
    sort?: { [key: string]: SortOrder }
  ): Promise<ISpecInventory[]> {
    const list = await ModelSpecInventory.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {SpecInventoryUpdateParams} filterParams - 用於篩選的參數
   * @param {SpecInventoryUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelSpecInventory>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<SpecInventoryUpdateParams>,
    updateParams: SpecInventoryUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelSpecInventory> {
    return await ModelSpecInventory.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {SpecInventoryDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelSpecInventory>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<SpecInventoryDeleteParams>,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelSpecInventory> {
    return await ModelSpecInventory.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {SpecInventoryDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<SpecInventoryDeleteResult>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteMany(
    params: SpecInventoryDeleteParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<SpecInventoryDeleteResult> {
    return await ModelSpecInventory.deleteMany(params, session);
  }

  public async deleteSpecInventory(productId:string,specId: string): Promise<ModelSpecInventory> {
    return await ModelSpecInventory.deleteSpecInventory(productId,specId);
  }
}
