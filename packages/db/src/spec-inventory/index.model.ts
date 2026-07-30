import mongoose, { FilterQuery, SortOrder } from "mongoose";
import {
  ISpecInventory,
  SpecInventoryAddParams,
  SpecInventoryAttributes,
  SpecInventoryBulkUpdateCustomParams,
  SpecInventoryBulkUpdateParams,
  SpecInventoryDeleteParams,
  SpecInventoryDeleteResult,
  SpecInventoryGetParams,
  SpecInventorySchema,
  SpecInventoryUpdateParams,
  tableSpecInventory,
} from "./index.type";
import { getPhotoModel } from "../photo/index.model";
import { getProductModel } from "../product/index.model";

export function getSpecInventoryModel() {
  const result =
    (mongoose.models[tableSpecInventory] as mongoose.Model<ISpecInventory>) ||
    mongoose.model<ISpecInventory>(tableSpecInventory, SpecInventorySchema);
  return result;
}

export class ModelSpecInventory {
  data!: ISpecInventory;

  constructor(obj: SpecInventoryAttributes) {
    const specInventoryModel = getSpecInventoryModel();
    this.data = new specInventoryModel(obj);
  }

  /**
   * 取得
   * @param {SpecInventoryGetParams} params
   * @returns {ISpecInventory|null}
   */
  public static async get(
    params: FilterQuery<SpecInventoryGetParams>,
  ): Promise<ISpecInventory | null> {
    const find = await getSpecInventoryModel().findOne(params);
    return find;
  }

  public static async getData(
    params: FilterQuery<SpecInventoryGetParams>,
    sort?: { [key: string]: SortOrder },
  ) {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getSpecInventoryModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query;
  }

  /**
   * 新增
   * @param {SpecInventoryAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelSpecInventory} SpecInventory詳細
   */
  public static async add(
    params: SpecInventoryAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelSpecInventory> {
    try {
      const specInventoryModel = getSpecInventoryModel();
      const table = new specInventoryModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelSpecInventory(newData);
      return result;
    } catch (error) {
      throw new Error(`新增SpecInventory失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {OrderAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelOrder[]} 返回多筆SpecInventory詳細
   */
  public static async addMany(
    params_list: SpecInventoryAddParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelSpecInventory[]> {
    try {
      const inserted_data = session
        ? await getSpecInventoryModel().insertMany(params_list, { session })
        : await getSpecInventoryModel().insertMany(params_list);

      return inserted_data.map((data) => new ModelSpecInventory(data));
    } catch (error) {
      throw new Error(`新增多筆 SpecInventory 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {SpecInventoryUpdateParams} filterParams - 用於篩選的參數
   * @param {SpecInventoryUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelSpecInventory>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<SpecInventoryUpdateParams>,
    updateParams: SpecInventoryUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelSpecInventory> {
    try {
      const newData = await getSpecInventoryModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelSpecInventory(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<SpecInventoryUpdateParams>,
    updateParams: SpecInventoryUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getSpecInventoryModel()
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
    updates: SpecInventoryBulkUpdateParams[],
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

    const result = await getSpecInventoryModel().bulkWrite(ops, { session });

    if (result.matchedCount === 0) {
      throw new Error("沒有找到匹配的條件進行更新");
    }

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  public static async updateBulkCutom(
    updates: SpecInventoryBulkUpdateCustomParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    if (!updates.length) {
      throw new Error("更新資料不可為空");
    }

    const ops = updates.map((item) => ({
      updateOne: {
        filter: item.filter,
        update: { $set: item.updateData },
      },
    }));

    const result = await getSpecInventoryModel().bulkWrite(ops, { session });

    if (result.matchedCount === 0) {
      throw new Error("沒有找到匹配的條件進行更新");
    }

    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * 刪除
   * @param {SpecInventoryDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelSpecInventory | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: SpecInventoryDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelSpecInventory> {
    try {
      const deletedData = await getSpecInventoryModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelSpecInventory(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {SpecInventoryDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<SpecInventoryDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: SpecInventoryDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<SpecInventoryDeleteResult> {
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
      const deletedData = await getSpecInventoryModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getSpecInventoryModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async deleteSpecInventory(
    productId: string,
    specId: string,
  ): Promise<ModelSpecInventory> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const spec = await getSpecInventoryModel().findById(specId);
      if (!spec) throw new Error("找不到指定的規格");

      const specCount = await getSpecInventoryModel().countDocuments({
        productUuid: spec.productUuid,
      });

      if (specCount <= 1) {
        throw new Error("刪除失敗：每個商品至少要保留一個規格");
      }

      // 刪除該規格的照片
      await getPhotoModel().deleteMany({ specUuid: spec._id }).session(session);

      // 刪除規格
      const deletedSpec = await getSpecInventoryModel()
        .findByIdAndDelete(spec._id)
        .session(session)
        .exec();

      if (!deletedSpec) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      // await session.commitTransaction();
      session.endSession();

      return new ModelSpecInventory(deletedSpec);
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("刪除規格失敗:", err);
      throw new Error(err.message);
    }
  }

  public static async toggleSpecInventoryStatus(id: string, isActive: boolean) {
    return await getSpecInventoryModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );
  }

  // public static async initDataForTest() {
  //   const result = await ModelSpecInventory.getData({});
  //   if (result.length) {
  //     return;
  //   }
  //   const data: SpecInventoryAddParams[] = [
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
  //     await ModelSpecInventory.add({ ...item });
  //   }
  // }
}
