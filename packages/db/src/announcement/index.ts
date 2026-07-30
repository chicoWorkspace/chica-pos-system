import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelAnnouncement } from "./index.model";
import {
  AnnouncementAddParams,
  AnnouncementDeleteParams,
  AnnouncementGetParams,
  AnnouncementUpdateParams,
  LeanAnnouncement,
} from "./index.type";

export class Announcement {
  /**
   * 新增
   * @param {AnnouncementAddParams} params - 新參數
   * @returns {Promise<ModelAnnouncement>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: AnnouncementAddParams): Promise<ModelAnnouncement> {
    return await ModelAnnouncement.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {AnnouncementGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanAnnouncement>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: AnnouncementGetParams): Promise<LeanAnnouncement> {
    const info = await ModelAnnouncement.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  public async getData(
    params: FilterQuery<AnnouncementGetParams>,
    sort?: Record<string, SortOrder>,
  ): Promise<LeanAnnouncement[]> {
    const list = await ModelAnnouncement.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {AnnouncementUpdateParams} filterParams - 用於篩選的參數
   * @param {AnnouncementUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelAnnouncement>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<AnnouncementUpdateParams>,
    updateParams: AnnouncementUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    return await ModelAnnouncement.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {AnnouncementDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelAnnouncement>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<AnnouncementDeleteParams>,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    return await ModelAnnouncement.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {String} Announcement_id - 分類_id
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelAnnouncement>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteAnnouncement(
    Announcement_id: string,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    return await ModelAnnouncement.deleteAnnouncement(Announcement_id, session);
  }
}
