import mongoose, { FilterQuery, SortOrder } from "mongoose";
import {
  CartAddParams,
  CartAttributes,
  CartBulkUpdateParams,
  CartDeleteParams,
  CartDeleteResult,
  CartGetParams,
  CartResultData,
  CartSchema,
  CartUpdateParams,
  ICart,
  tableCart,
} from "./index.type";
import { tableAdmin } from "../admin/index.type";
import { tableSpecInventory } from "../spec-inventory/index.type";

export function getCartModel() {
  const result =
    (mongoose.models[tableCart] as mongoose.Model<ICart>) ||
    mongoose.model<ICart>(tableCart, CartSchema);
  return result;
}

export class ModelCart {
  data!: ICart;

  constructor(obj: CartAttributes) {
    const CartModel = getCartModel();
    this.data = new CartModel(obj);
  }

  /**
   * 取得
   * @param {CartGetParams} params
   * @returns {ICart|null}
   */
  public static async get(
    params: FilterQuery<CartGetParams>,
  ): Promise<ICart | null> {
    const find = await getCartModel().findOne(params);
    return find;
  }

  public static async getData(
    params: FilterQuery<CartGetParams>,
    sort?: { [key: string]: SortOrder },
  ) {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getCartModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query;
  }

  public static async getCarts(
    params: FilterQuery<CartGetParams>,
  ): Promise<CartResultData> {
    const Carts = await getCartModel()
      .findOne(params)
      .populate({
        path: "items.specId",
        model: tableSpecInventory,
      })
      .lean();

    return Carts as unknown as CartResultData;
  }

  /**
   * 新增
   * @param {CartAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelCart} Cart詳細
   */
  public static async add(
    params: CartAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCart> {
    try {
      const CartModel = getCartModel();
      const table = new CartModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelCart(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Cart失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {OrderAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelOrder[]} 返回多筆Cart詳細
   */
  public static async addMany(
    params_list: CartAddParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCart[]> {
    try {
      const inserted_data = session
        ? await getCartModel().insertMany(params_list, { session })
        : await getCartModel().insertMany(params_list);

      return inserted_data.map((data) => new ModelCart(data));
    } catch (error) {
      throw new Error(`新增多筆 Cart 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {CartUpdateParams} filterParams - 用於篩選的參數
   * @param {CartUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCart>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<CartUpdateParams>,
    updateParams: CartUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCart> {
    try {
      const newData = await getCartModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelCart(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<CartUpdateParams>,
    updateParams: CartUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getCartModel()
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
    updates: CartBulkUpdateParams[],
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

    const result = await getCartModel().bulkWrite(ops, { session });

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
   * @param {CartDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCart | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: CartDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCart> {
    try {
      const deletedData = await getCartModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelCart(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {CartDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<CartDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: CartDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<CartDeleteResult> {
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
      const deletedData = await getCartModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getCartModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }
}
