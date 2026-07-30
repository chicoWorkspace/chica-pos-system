import mongoose, { FilterQuery, SortOrder, Types } from "mongoose";
import { ModelProduct } from "../product/index.model";
import {
  GroupPermissionsAddParams,
  GroupPermissionsAttributes,
  GroupPermissionsDeleteParams,
  GroupPermissionsDeleteResult,
  GroupPermissionsGetParams,
  GroupPermissionsSchema,
  GroupPermissionsUpdateParams,
  IGroupPermissions,
  LeanGroupPermissions,
  tableGroupPermissions,
} from "./index.type";

export function getGroupPermissionsModel() {
  const result =
    (mongoose.models[
      tableGroupPermissions
    ] as mongoose.Model<IGroupPermissions>) ||
    mongoose.model<IGroupPermissions>(
      tableGroupPermissions,
      GroupPermissionsSchema
    );
  return result;
}

export class ModelGroupPermissions {
  data!: IGroupPermissions;

  constructor(obj: GroupPermissionsAttributes) {
    const GroupPermissionsModel = getGroupPermissionsModel();
    this.data = new GroupPermissionsModel(obj);
  }

  /**
   * 取得
   * @param {GroupPermissionsGetParams} params
   * @returns {IGroupPermissions|null}
   */
  public static async get(
    params: FilterQuery<GroupPermissionsGetParams>
  ): Promise<LeanGroupPermissions | null> {
    const find = await getGroupPermissionsModel().findOne(params).lean();
    return find;
  }

  public static async getData(
    params: FilterQuery<GroupPermissionsGetParams>,
    sort?: { [key: string]: SortOrder }
  ): Promise<LeanGroupPermissions[] | null> {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getGroupPermissionsModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query.lean();
  }

  /**
   * 新增
   * @param {GroupPermissionsAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelGroupPermissions} GroupPermissions詳細
   */
  public static async add(
    params: GroupPermissionsAddParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    try {
      const GroupPermissionsModel = getGroupPermissionsModel();
      const table = new GroupPermissionsModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelGroupPermissions(newData);
      return result;
    } catch (error) {
      throw new Error(`新增GroupPermissions失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {GroupPermissionsAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelPage[]} 返回多筆SpecInventory詳細
   */
  public static async addMany(
    params_list: GroupPermissionsAddParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions[]> {
    try {
      const inserted_data = session
        ? await getGroupPermissionsModel().insertMany(params_list, { session })
        : await getGroupPermissionsModel().insertMany(params_list);

      return inserted_data.map(
        (data) =>
          new ModelGroupPermissions({
            ...data.toObject(), // <- 轉成普通物件
            groupId: new Types.ObjectId(data.groupId), // <- 確保是 ObjectId
            pageId: new Types.ObjectId(data.pageId),
          })
      );
    } catch (error) {
      throw new Error(`新增多筆 Page 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {GroupPermissionsUpdateParams} filterParams - 用於篩選的參數
   * @param {GroupPermissionsUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroupPermissions>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<GroupPermissionsUpdateParams>,
    updateParams: GroupPermissionsUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    try {
      const newData = await getGroupPermissionsModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session }
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelGroupPermissions(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<GroupPermissionsUpdateParams>,
    updateParams: GroupPermissionsUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getGroupPermissionsModel()
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

  /**
   * 刪除
   * @param {GroupPermissionsDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelGroupPermissions | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: GroupPermissionsDeleteParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    try {
      const deletedData = await getGroupPermissionsModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelGroupPermissions(deletedData);
    } catch (error) {
      throw error;
    }
  }

  public static async deleteGroupPermissions(
    GroupPermissions_id: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelGroupPermissions> {
    try {
      const product = await ModelProduct.get({
        GroupPermissionsUuid: GroupPermissions_id,
      });
      if (product) {
        throw new Error("刪除失敗，該分類尚有商品");
      }

      const deletedData = await getGroupPermissionsModel()
        .findOneAndDelete(
          { _id: GroupPermissions_id },
          {
            session,
          }
        )
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelGroupPermissions(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {GroupPermissionsDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<GroupPermissionsDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: GroupPermissionsDeleteParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<GroupPermissionsDeleteResult> {
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
      const deletedData = await getGroupPermissionsModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getGroupPermissionsModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async toggleGroupPermissionsStatus(
    id: string,
    isActive: boolean
  ) {
    return await getGroupPermissionsModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
  }

  // public static async initDataForTest() {
  //   const result = await ModelGroupPermissions.getData({});
  //   if (result.length) {
  //     return;
  //   }
  //   const data: GroupPermissionsAddParams[] = [
  //     {
  //       name: "富優達株式会社",
  //       order: 0,
  //       isActive: false,
  //       image: "",
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     },
  //   ];
  //   for (const item of data) {
  //     await ModelGroupPermissions.add({ ...item });
  //   }
  // }
}
