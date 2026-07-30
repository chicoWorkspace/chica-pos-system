import mongoose, { FilterQuery, get, SortOrder } from "mongoose";
import {
  IPhoto,
  PhotoAddParams,
  PhotoAttributes,
  PhotoBulkUpdateParams,
  PhotoDeleteParams,
  PhotoDeleteResult,
  PhotoGetParams,
  PhotoSchema,
  PhotoUpdateParams,
  tablePhoto,
} from "./index.type";

export function getPhotoModel() {
  const result =
    (mongoose.models[tablePhoto] as mongoose.Model<IPhoto>) ||
    mongoose.model<IPhoto>(tablePhoto, PhotoSchema);
  return result;
}

export class ModelPhoto {
  data!: IPhoto;

  constructor(obj: PhotoAttributes) {
    const photoModel = getPhotoModel();
    this.data = new photoModel(obj);
  }

  /**
   * 取得
   * @param {PhotoGetParams} params
   * @returns {IPhoto|null}
   */
  public static async get(
    params: FilterQuery<PhotoGetParams>,
  ): Promise<IPhoto | null> {
    const find = await getPhotoModel().findOne(params);
    return find;
  }

  public static async getData(
    params: FilterQuery<PhotoGetParams>,
    sort?: { [key: string]: SortOrder },
  ) {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getPhotoModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query;
  }

  /**
   * 新增
   * @param {PhotoAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelPhoto} Photo詳細
   */
  public static async add(
    params: PhotoAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelPhoto> {
    try {
      const photoModel = getPhotoModel();
      const table = new photoModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelPhoto(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Photo失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {PhotoAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelPhoto[]} 返回多筆SpecInventory詳細
   */
  public static async addMany(
    params_list: PhotoAddParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelPhoto[]> {
    try {
      const inserted_data = session
        ? await getPhotoModel().insertMany(params_list, { session })
        : await getPhotoModel().insertMany(params_list);

      return inserted_data.map((data) => new ModelPhoto(data));
    } catch (error) {
      throw new Error(`新增多筆 Photo 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {PhotoUpdateParams} filterParams - 用於篩選的參數
   * @param {PhotoUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPhoto>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<PhotoUpdateParams>,
    updateParams: PhotoUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelPhoto> {
    try {
      const newData = await getPhotoModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelPhoto(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<PhotoUpdateParams>,
    updateParams: PhotoUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getPhotoModel()
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
    updates: PhotoBulkUpdateParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    if (!updates.length) {
      throw new Error("更新資料不可為空");
    }

    // 過濾 undefined 欄位
    const cleanUndefined = <T extends object>(obj: T): Partial<T> => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined),
      ) as Partial<T>;
    };

    const ops = updates.map((item) => {
      const { _id, ...restUpdateData } = item.updateData as any;

      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item._id) },
          update: { $set: restUpdateData },
        },
      };
    });

    const result = await getPhotoModel().bulkWrite(ops, { session });

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * 刪除
   * @param {PhotoDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPhoto | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: PhotoDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelPhoto> {
    try {
      const deletedData = await getPhotoModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelPhoto(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {PhotoDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<PhotoDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: PhotoDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<PhotoDeleteResult> {
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
      const deletedData = await getPhotoModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getPhotoModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async togglePhotoStatus(id: string, isActive: boolean) {
    return await getPhotoModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );
  }

  // public static async initDataForTest() {
  //   const result = await ModelPhoto.getData({});
  //   if (result.length) {
  //     return;
  //   }
  //   const data: PhotoAddParams[] = [
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
  //     await ModelPhoto.add({ ...item });
  //   }
  // }
}
