import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelGroupPermissions } from "./index.model";
import {
  GroupPermissionsAddParams,
  GroupPermissionsDeleteParams,
  GroupPermissionsGetParams,
  GroupPermissionsUpdateParams,
  LeanGroupPermissions,
} from "./index.type";
import { ModelPage } from "../page/index.model";

export class GroupPermissions {
  /**
   * 新增
   * @param {GroupPermissionsAddParams} params - 新參數
   * @returns {Promise<ModelGroupPermissions>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(
    params: GroupPermissionsAddParams
  ): Promise<ModelGroupPermissions> {
    return await ModelGroupPermissions.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {GroupPermissionsGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanGroupPermissions>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(
    params: GroupPermissionsGetParams
  ): Promise<LeanGroupPermissions> {
    const info = await ModelGroupPermissions.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  /**
   * 根據給定參數查找信息
   * @param {GroupPermissionsGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanGroupPermissions[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: GroupPermissionsGetParams,
    sort?: { [key: string]: SortOrder }
  ): Promise<LeanGroupPermissions[]> {
    const list = await ModelGroupPermissions.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {GroupPermissionsUpdateParams} filterParams - 用於篩選的參數
   * @param {GroupPermissionsUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroupPermissions>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<GroupPermissionsUpdateParams>,
    updateParams: GroupPermissionsUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    return await ModelGroupPermissions.update(
      filterParams,
      updateParams,
      session
    );
  }

  /**
   * 刪除
   * @param {GroupPermissionsDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroupPermissions>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<GroupPermissionsDeleteParams>,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    return await ModelGroupPermissions.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {String} GroupPermissions_id - 分類_id
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroupPermissions>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteGroupPermissions(
    GroupPermissions_id: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    return await ModelGroupPermissions.deleteGroupPermissions(
      GroupPermissions_id,
      session
    );
  }

  /**
   * @method setPermission
   * @desc 切換指定群組在特定頁面的單一權限（toggle）
   *        - 若該權限 key 不存在於 Page 的 permissions 中，則視為非法操作。
   *        - 若群組目前擁有該權限則移除，否則新增。
   * @param {string} pageId - 目標頁面的 ID
   * @param {string} groupId - 目標群組的 ID
   * @param {string} permissionKey - 欲切換的權限代碼 (例如: "create"、"edit"、"delete")
   * @returns {Promise<ModelGroupPermissions>} 更新後的群組權限紀錄
   * @throws {Error} 若找不到 Page 或 GroupPermission，或權限 key 不合法則拋出錯誤
   */
  public async setPermission(
    pageId: string,
    groupId: string,
    permissionKey: string
  ): Promise<ModelGroupPermissions> {
    const page = await ModelPage.get({ _id: pageId });
    if (!page) {
      throw new Error("找不到符合的Page");
    }

    const hasKey = page.permissions.some((perm) => perm.key === permissionKey);
    if (!hasKey) {
      throw new Error("Key不符合規範");
    }

    const groupPermission = await ModelGroupPermissions.get({
      pageId,
      groupId,
    });

    if (!groupPermission) {
      return await ModelGroupPermissions.add({
        groupId,
        pageId,
        permissions: [permissionKey],
      });
    }

    const permissions = groupPermission.permissions;

    const newPermissions = permissions.includes(permissionKey)
      ? permissions.filter((item) => item !== permissionKey)
      : [...permissions, permissionKey];

    const newGroupPermission = await ModelGroupPermissions.update(
      { groupId, pageId },
      { permissions: newPermissions }
    );

    return newGroupPermission;
  }
}
