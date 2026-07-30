import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelProduct } from "../product/index.model";
import {
  AnnouncementAddParams,
  AnnouncementAttributes,
  AnnouncementDeleteParams,
  AnnouncementDeleteResult,
  AnnouncementGetParams,
  AnnouncementSchema,
  AnnouncementUpdateParams,
  IAnnouncement,
  LeanAnnouncement,
  tableAnnouncement,
} from "./index.type";
import { tableProduct } from "../product/index.type";

export function getAnnouncementModel() {
  const result =
    (mongoose.models[tableAnnouncement] as mongoose.Model<IAnnouncement>) ||
    mongoose.model<IAnnouncement>(tableAnnouncement, AnnouncementSchema);
  return result;
}

export class ModelAnnouncement {
  data!: IAnnouncement;

  constructor(obj: AnnouncementAttributes) {
    const AnnouncementModel = getAnnouncementModel();
    this.data = new AnnouncementModel(obj);
  }

  /**
   * 取得
   * @param {AnnouncementGetParams} params
   * @returns {IAnnouncement|null}
   */
  public static async get(
    params: FilterQuery<AnnouncementGetParams>,
  ): Promise<LeanAnnouncement | null> {
    const find = await getAnnouncementModel().findOne(params).lean();
    return find;
  }

  public static async getData(
    params: FilterQuery<AnnouncementGetParams>,
    sort?: { [key: string]: SortOrder },
  ): Promise<LeanAnnouncement[] | null> {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getAnnouncementModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query.lean();
  }

  /**
   * 新增
   * @param {AnnouncementAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelAnnouncement} Announcement詳細
   */
  public static async add(
    params: AnnouncementAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    try {
      const AnnouncementModel = getAnnouncementModel();
      const table = new AnnouncementModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelAnnouncement(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Announcement失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {AnnouncementUpdateParams} filterParams - 用於篩選的參數
   * @param {AnnouncementUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelAnnouncement>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<AnnouncementUpdateParams>,
    updateParams: AnnouncementUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    try {
      const newData = await getAnnouncementModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelAnnouncement(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<AnnouncementUpdateParams>,
    updateParams: AnnouncementUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getAnnouncementModel()
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
   * @param {AnnouncementDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelAnnouncement | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: AnnouncementDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    try {
      const deletedData = await getAnnouncementModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelAnnouncement(deletedData);
    } catch (error) {
      throw error;
    }
  }

  public static async deleteAnnouncement(
    Announcement_id: string,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAnnouncement> {
    try {
      const product = await ModelProduct.get({
        AnnouncementUuid: Announcement_id,
      });
      if (product) {
        throw new Error("刪除失敗，該分類尚有商品");
      }

      const deletedData = await getAnnouncementModel()
        .findOneAndDelete(
          { _id: Announcement_id },
          {
            session,
          },
        )
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelAnnouncement(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {AnnouncementDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<AnnouncementDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: AnnouncementDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<AnnouncementDeleteResult> {
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
      const deletedData = await getAnnouncementModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getAnnouncementModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async toggleAnnouncementStatus(id: string, isActive: boolean) {
    return await getAnnouncementModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );
  }

  // public static async initDataForTest() {
  //   const result = await ModelAnnouncement.getData({});
  //   if (result.length) {
  //     return;
  //   }
  //   const data: AnnouncementAddParams[] = [
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
  //     await ModelAnnouncement.add({ ...item });
  //   }
  // }
}
