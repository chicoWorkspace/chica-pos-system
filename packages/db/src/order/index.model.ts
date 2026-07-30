import mongoose, { FilterQuery, SortOrder } from "mongoose";
import {
  OrderAddParams,
  OrderAttributes,
  OrderBulkUpdateParams,
  OrderDeleteParams,
  OrderDeleteResult,
  OrderGetParams,
  OrderResultData,
  OrderSchema,
  OrderUpdateParams,
  IOrder,
  tableOrder,
} from "./index.type";
import { tableAdmin } from "../admin/index.type";
import { tableSpecInventory } from "../spec-inventory/index.type";

export function getOrderModel() {
  const result =
    (mongoose.models[tableOrder] as mongoose.Model<IOrder>) ||
    mongoose.model<IOrder>(tableOrder, OrderSchema);
  return result;
}

export class ModelOrder {
  data!: IOrder;

  constructor(obj: OrderAttributes) {
    const OrderModel = getOrderModel();
    this.data = new OrderModel(obj);
  }

  /**
   * 取得
   * @param {OrderGetParams} params
   * @returns {IOrder|null}
   */
  public static async get(
    params: FilterQuery<OrderGetParams>,
  ): Promise<IOrder | null> {
    const find = await getOrderModel().findOne(params);
    return find;
  }

  public static async getData(
    params: FilterQuery<OrderGetParams>,
    sort?: { [key: string]: SortOrder },
  ) {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getOrderModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query;
  }

  /**
   * 新增
   * @param {OrderAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelOrder} Order詳細
   */
  public static async add(
    params: OrderAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelOrder> {
    try {
      const OrderModel = getOrderModel();
      const table = new OrderModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelOrder(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Order失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {OrderAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelOrder[]} 返回多筆Order詳細
   */
  public static async addMany(
    params_list: OrderAddParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelOrder[]> {
    try {
      const inserted_data = session
        ? await getOrderModel().insertMany(params_list, { session })
        : await getOrderModel().insertMany(params_list);

      return inserted_data.map((data) => new ModelOrder(data));
    } catch (error) {
      throw new Error(`新增多筆 Order 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {OrderUpdateParams} filterParams - 用於篩選的參數
   * @param {OrderUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelOrder>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<OrderUpdateParams>,
    updateParams: OrderUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelOrder> {
    try {
      const newData = await getOrderModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelOrder(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<OrderUpdateParams>,
    updateParams: OrderUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getOrderModel()
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
    updates: OrderBulkUpdateParams[],
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

    const result = await getOrderModel().bulkWrite(ops, { session });

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
   * @param {OrderDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelOrder | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: OrderDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelOrder> {
    try {
      const deletedData = await getOrderModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelOrder(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {OrderDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<OrderDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: OrderDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<OrderDeleteResult> {
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
      const deletedData = await getOrderModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getOrderModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }
}
