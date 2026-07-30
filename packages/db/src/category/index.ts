import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelCategory } from "./index.model";
import {
  CategoryAddParams,
  CategoryDeleteParams,
  CategoryGetParams,
  CategoryUpdateParams,
  LeanCategory,
} from "./index.type";

export class Category {
  /**
   * 新增
   * @param {CategoryAddParams} params - 新參數
   * @returns {Promise<ModelCategory>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: CategoryAddParams): Promise<ModelCategory> {
    return await ModelCategory.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {CategoryGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanCategory>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: CategoryGetParams): Promise<LeanCategory> {
    const info = await ModelCategory.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  /**
   * 根據給定參數查找信息
   * @param {CategoryGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanCategory[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: CategoryGetParams,
    sort?: { [key: string]: SortOrder }
  ): Promise<LeanCategory[]> {
    const list = await ModelCategory.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {CategoryUpdateParams} filterParams - 用於篩選的參數
   * @param {CategoryUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCategory>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<CategoryUpdateParams>,
    updateParams: CategoryUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelCategory> {
    return await ModelCategory.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {CategoryDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCategory>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<CategoryDeleteParams>,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelCategory> {
    return await ModelCategory.deleteOne(params, session);
  }


    /**
   * 刪除
   * @param {String} category_id - 分類_id
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCategory>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteCategory(
    category_id: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelCategory> {
    return await ModelCategory.deleteCategory(category_id, session);
  }
}
