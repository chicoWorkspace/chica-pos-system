import mongoose, { FilterQuery, SortOrder } from "mongoose";
import {
  GroupAddParams,
  GroupAttributes,
  GroupBulkUpdateParams,
  GroupDeleteParams,
  GroupDeleteResult,
  GroupGetParams,
  GroupResultData,
  GroupSchema,
  GroupUpdateParams,
  IGroup,
  tableGroup,
} from "./index.type";
import { tableAdmin } from "../admin/index.type";

export function getGroupModel() {
  const result =
    (mongoose.models[tableGroup] as mongoose.Model<IGroup>) ||
    mongoose.model<IGroup>(tableGroup, GroupSchema);
  return result;
}

export class ModelGroup {
  data!: IGroup;

  constructor(obj: GroupAttributes) {
    const GroupModel = getGroupModel();
    this.data = new GroupModel(obj);
  }

  /**
   * 取得
   * @param {GroupGetParams} params
   * @returns {IGroup|null}
   */
  public static async get(
    params: FilterQuery<GroupGetParams>,
  ): Promise<IGroup | null> {
    const find = await getGroupModel().findOne(params);
    return find;
  }

  public static async getData(
    params: FilterQuery<GroupGetParams>,
    sort?: { [key: string]: SortOrder },
  ) {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getGroupModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query;
  }

  public static async getGroups(
    params: FilterQuery<GroupGetParams>,
  ): Promise<GroupResultData[]> {
    const groups = await getGroupModel()
      .find(params)
      .populate({
        path: "members.userId",
        model: tableAdmin,
        select: "username isActive",
      })
      .lean();

    return groups as unknown as GroupResultData[];
  }

  /**
   * 新增
   * @param {GroupAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelGroup} Group詳細
   */
  public static async add(
    params: GroupAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelGroup> {
    try {
      const GroupModel = getGroupModel();
      const table = new GroupModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelGroup(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Group失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {OrderAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelOrder[]} 返回多筆Group詳細
   */
  public static async addMany(
    params_list: GroupAddParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelGroup[]> {
    try {
      const inserted_data = session
        ? await getGroupModel().insertMany(params_list, { session })
        : await getGroupModel().insertMany(params_list);

      return inserted_data.map((data) => new ModelGroup(data));
    } catch (error) {
      throw new Error(`新增多筆 Group 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {GroupUpdateParams} filterParams - 用於篩選的參數
   * @param {GroupUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroup>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<GroupUpdateParams>,
    updateParams: GroupUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelGroup> {
    try {
      const newData = await getGroupModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelGroup(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<GroupUpdateParams>,
    updateParams: GroupUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getGroupModel()
        .updateMany(filterParams, { $set: updateParams }, { session })
        .exec();

      if (updateResult.matchedCount === 0) {
        throw new Error("沒有找到匹配的條件進行更新");
      }

      return {
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount,
      };
    } catch (error) {
      throw new Error(`批量更新失敗: ${error}`);
    }
  }

  public static async updateBulk(
    updates: GroupBulkUpdateParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    if (!updates.length) {
      throw new Error("更新資料不可為空");
    }

    const ops = updates.map((item) => {
      const { _id, ...restUpdateData } = item.updateData as any;

      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item._id) },
          update: { $set: restUpdateData },
        },
      };
    });

    const result = await getGroupModel().bulkWrite(ops, { session });

    if (result.matchedCount === 0) {
      throw new Error("沒有找到匹配的條件進行更新");
    }

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * 新增一位 Admin 至指定組別 (若重複則忽略)
   * @param groupId 組別 ID
   * @param adminId Admin 的 ObjectId
   * @param role 組內角色
   * @param checkDuplicate 是否檢查重複成員，預設為 true
   * @param session 可選 Transaction session
   */
  public static async addNewAdminToGroup(
    groupId: string,
    adminId: mongoose.Types.ObjectId,
    role: "leader" | "member" = "member",
    checkDuplicate: boolean = true,
    session?: mongoose.mongo.ClientSession,
  ): Promise<GroupResultData> {
    const filter: Record<string, any> = { _id: groupId };
    if (checkDuplicate) {
      filter["members.userId"] = { $ne: adminId };
    }
    const updatedGroup = await getGroupModel()
      .findOneAndUpdate(
        filter,
        {
          $push: {
            members: {
              userId: adminId,
              role,
              joinedAt: new Date(),
            },
          },
        },
        { new: true, session },
      )
      .populate({
        path: "members.userId",
        model: tableAdmin,
        select: "username isActive",
      });

    if (!updatedGroup) {
      throw new Error("該管理員已存在於組別或組別不存在");
    }

    return updatedGroup as unknown as GroupResultData;
  }

  /**
   * 刪除
   * @param {GroupDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroup | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: GroupDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelGroup> {
    try {
      const deletedData = await getGroupModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelGroup(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {GroupDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<GroupDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: GroupDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<GroupDeleteResult> {
    try {
      const orConditions = filterParamsArray.map((params) => {
        const conditions = Object.entries(params).map(([key, value]) => {
          if (key === "_id") {
            return {
              [key]:
                typeof value === "string"
                  ? new mongoose.Types.ObjectId(value)
                  : value,
            };
          }
          return { [key]: value };
        });
        return { $and: conditions };
      });
      const deletedData = await getGroupModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getGroupModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async removeMember(
    groupId: string,
    adminId: string,
    session?: mongoose.mongo.ClientSession,
  ): Promise<GroupResultData> {
    const updatedGroup = await getGroupModel()
      .findByIdAndUpdate(
        groupId,
        { $pull: { members: { userId: adminId } } },
        { new: true, session },
      )
      .populate({
        path: "members.userId",
        model: tableAdmin,
        select: "username isActive",
      });

    return updatedGroup as unknown as GroupResultData;
  }
}
