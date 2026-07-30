import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelGroup } from "./index.model";
import {
  GroupAddParams,
  GroupDeleteParams,
  GroupGetParams,
  GroupUpdateParams,
  IGroup,
  GroupDeleteResult,
  GroupResultData,
} from "./index.type";
import { ModelAdmin } from "../admin/index.model";
import { Admin } from "../admin";
import { ModelPage } from "../page/index.model";
import { ModelGroupPermissions } from "../group-permissions/index.model";
import { GroupPermissionsAddParams } from "../group-permissions/index.type";
import { Page } from "../page";
import { GroupPermissions } from "../group-permissions";

export class Group {
  /**
   * 新增
   * @param {GroupAddParams} params - 新參數
   * @returns {Promise<ModelGroup>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: GroupAddParams): Promise<ModelGroup> {
    //插入資料時要轉成ObjectId
    //product_uuid: new mongoose.Types.ObjectId("64f1a2...")

    return await ModelGroup.add(params);
  }

  public async create(params: GroupAddParams): Promise<ModelGroup> {
    const pages = await ModelPage.getData({});

    // 準備每個頁面的權限 key 陣列
    const pageKey: {
      pageId: string;
      keys: string[];
    }[] = (pages || []).map((page) => {
      return {
        pageId: page._id.toString(),
        keys: page.permissions.map((perm) => perm.key),
      };
    });

    const session = await mongoose.startSession();

    try {
      session.startTransaction({ readPreference: "primary" });
      const newGroup = await ModelGroup.add(params, session);

      if (pageKey.length > 0) {
        // 同時建立該組別的頁面權限初始資料
        const addPermissionData: GroupPermissionsAddParams[] = pageKey.map(
          (page) => ({
            groupId: newGroup.data._id.toString(),
            pageId: page.pageId,
            permissions: [],
          }),
        );
        await ModelGroupPermissions.addMany(addPermissionData, session);
      }

      await session.commitTransaction();
      session.endSession();
      return newGroup;
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(err.message);
    }
  }

  public async addMember(
    groupId: string,
    userId: string,
    role: "leader" | "member" = "member",
  ) {
    // AdminModel
  }
  /**
   * 新增管理員到組別（若帳號不存在則自動建立）
   * @param groupId 組別 ID
   * @param username 管理員帳號
   * @param password 管理員密碼
   * @param role 組內角色（leader/member）
   * @returns 更新後的 Group 文件（含 populate 資料）
   */
  public async addNewAdminToGroup(
    groupId: string,
    username: string,
    password: string,
  ): Promise<GroupResultData> {
    // 1️⃣ 檢查 Group 是否存在
    const group = await ModelGroup.get({ _id: groupId });
    if (!group) {
      throw new Error("找不到指定的組別");
    }

    // 2️⃣ 檢查 Admin 是否存在，不存在則建立
    const admin = await ModelAdmin.get({ username });
    if (admin) {
      throw new Error("該管理員已存在");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction({ readPreference: "primary" });

      const adminFeature = new Admin();
      const newAdmin = await adminFeature.create(
        {
          username,
          password,
          isActive: true,
        },
        session,
      );

      const groupFeature = new Group();
      const currentGroup = await groupFeature.get({ _id: groupId });
      const members = currentGroup.members;

      const updatedGroup = await ModelGroup.addNewAdminToGroup(
        groupId,
        newAdmin.data._id,
        members.length === 0 ? "leader" : "member",
        true,
        session,
      );

      await session.commitTransaction();
      session.endSession();
      return updatedGroup;
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(err.message);
    }
  }
  /**
   * 根據給定參數查找信息
   * @param {GroupGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IGroup>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: GroupGetParams): Promise<IGroup> {
    const info = await ModelGroup.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  /**
   * 根據給定參數查找信息
   * @param {GroupGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IGroup[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: GroupGetParams,
    sort?: { [key: string]: SortOrder },
  ): Promise<IGroup[]> {
    const list = await ModelGroup.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 根據給定參數查找信息
   * @param {GroupGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IGroup[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async groups(): Promise<GroupResultData[]> {
    const list = await ModelGroup.getGroups({});
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {GroupUpdateParams} filterParams - 用於篩選的參數
   * @param {GroupUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroup>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<GroupUpdateParams>,
    updateParams: GroupUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelGroup> {
    return await ModelGroup.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {GroupDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroup>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<GroupDeleteParams>,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelGroup> {
    return await ModelGroup.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {GroupDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<GroupDeleteResult>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteMany(
    params: GroupDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<GroupDeleteResult> {
    return await ModelGroup.deleteMany(params, session);
  }

  public async deleteGroup(groupId: string) {
    const group = await ModelGroup.get({ _id: groupId });
    if (!group) throw new Error("組別不存在");
    if (group.members.length > 0) throw new Error("無法刪除有成員的組別");

    const deletedGroup = await ModelGroup.deleteOne({ _id: groupId });
    return deletedGroup;
  }

  public async removeMember(groupId: string, adminId: string) {
    const group = await ModelGroup.get({ _id: groupId });
    if (!group) throw new Error("組別不存在");

    const member = group.members.find((m) => m.userId.toString() === adminId);
    if (!member) throw new Error("成員不存在");
    if (member.role === "leader") throw new Error("組長無法被移除");

    const updatedGroup = await ModelGroup.removeMember(groupId, adminId);
    return updatedGroup;
  }

  public async setMemberAsLeader(groupId: string, adminId: string) {
    const group = await ModelGroup.get({ _id: groupId });
    if (!group) throw new Error("組別不存在");

    const targetMember = group.members.find(
      (m) => m.userId.toString() === adminId,
    );
    if (!targetMember) throw new Error("該成員不在組別中");

    // 整理新組長跟更新其他為一般組員
    group.members = group.members.map((m) => {
      if (m.role === "leader") {
        return { ...m, role: "member" };
      } else if (m.userId.toString() === adminId) {
        return { ...m, role: "leader" };
      } else {
        return m;
      }
    });

    await group.save();

    const list = await ModelGroup.getGroups({ _id: groupId });
    if (!list) {
      throw new Error("查無組別");
    }

    return list[0];
  }

  public async initalData() {
    const username = "admin01";
    const password = "abcd1234";
    const groupName = "Admin";
    const pageList = [
      { key: "order", name: "點餐主頁" },
      { key: "product", name: "菜單設定" },
      { key: "purchase-history", name: "購買紀錄" },
      { key: "analytics", name: "分析" },
      { key: "setting", name: "系統設定" },
    ];

    const basePermissions = [
      {
        key: "create",
        name: "建立",
        description: "可以建立新項目",
      },
      {
        key: "edit",
        name: "編輯",
        description: "可以編輯項目",
      },
      {
        key: "delete",
        name: "刪除",
        description: "可以刪除項目",
      },
      {
        key: "view",
        name: "查看",
        description: "可以查看項目",
      },
    ];

    try {
      const searchGroup = await ModelGroup.get({ name: groupName });
      if (searchGroup) {
        return;
      }

      const group = await this.create({
        name: groupName,
        description: "高權限組別",
        members: [],
      });

      const updateGroup = await this.addNewAdminToGroup(
        group.data._id.toString(),
        username,
        password,
      );

      const pageFeature = new Page();
      const groupPermissionsFeature = new GroupPermissions();
      await Promise.all(
        pageList.map(async (pageObj) => {
          // 檢查該頁面是否已存在
          const page = await pageFeature.get({ key: pageObj.key });
          if (!page) {
            // 如果不存在，則新增
            const newPage = await pageFeature.add({
              name: pageObj.name,
              key: pageObj.key,
              permissions: basePermissions,
            });

            // 增加page權限
            await groupPermissionsFeature.add({
              groupId: updateGroup._id.toString(),
              pageId: newPage.data._id.toString(),
              permissions: ["view", "add", "edit", "delete"],
            });
          }
        }),
      );
    } catch (err) {
      console.log("初始化失敗", err);
    }
  }
}
