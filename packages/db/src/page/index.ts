import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelPage } from "./index.model";
import {
  PageAddParams,
  PageDeleteParams,
  PageGetParams,
  PageUpdateParams,
  LeanPage,
} from "./index.type";

export class Page {
  /**
   * 新增
   * @param {PageAddParams} params - 新參數
   * @returns {Promise<ModelPage>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: PageAddParams): Promise<ModelPage> {
    return await ModelPage.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {PageGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanPage>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: PageGetParams): Promise<LeanPage> {
    const info = await ModelPage.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  /**
   * 根據給定參數查找信息
   * @param {PageGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanPage[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: PageGetParams,
    sort?: { [key: string]: SortOrder }
  ): Promise<LeanPage[]> {
    const list = await ModelPage.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {PageUpdateParams} filterParams - 用於篩選的參數
   * @param {PageUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPage>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<PageUpdateParams>,
    updateParams: PageUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    return await ModelPage.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {PageDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPage>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<PageDeleteParams>,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    return await ModelPage.deleteOne(params, session);
  }


    /**
   * 刪除
   * @param {String} Page_id - 分類_id
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPage>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deletePage(
    Page_id: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    return await ModelPage.deletePage(Page_id, session);
  }
}
