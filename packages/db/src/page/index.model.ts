import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelProduct } from "../product/index.model";
import {
  PageAddParams,
  PageAttributes,
  PageDeleteParams,
  PageDeleteResult,
  PageGetParams,
  PageSchema,
  PageUpdateParams,
  IPage,
  LeanPage,
  tablePage,
} from "./index.type";

export function getPageModel() {
  const result =
    (mongoose.models[tablePage] as mongoose.Model<IPage>) ||
    mongoose.model<IPage>(tablePage, PageSchema);
  return result;
}

export class ModelPage {
  data!: IPage;

  constructor(obj: PageAttributes) {
    const PageModel = getPageModel();
    this.data = new PageModel(obj);
  }

  /**
   * 取得
   * @param {PageGetParams} params
   * @returns {IPage|null}
   */
  public static async get(
    params: FilterQuery<PageGetParams>
  ): Promise<LeanPage | null> {
    const find = await getPageModel().findOne(params).lean();
    return find;
  }

  public static async getData(
    params: FilterQuery<PageGetParams>,
    sort?: { [key: string]: SortOrder }
  ): Promise<LeanPage[] | null> {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getPageModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query.lean();
  }

  /**
   * 新增
   * @param {PageAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelPage} Page詳細
   */
  public static async add(
    params: PageAddParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    try {
      const PageModel = getPageModel();
      const table = new PageModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelPage(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Page失敗: ${error}`);
    }
  }

  /**
   * 新增多筆資料
   * @param {PageAddParams[]} params_list
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelPage[]} 返回多筆SpecInventory詳細
   */
  public static async addMany(
    params_list: PageAddParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage[]> {
    try {
      const inserted_data = session
        ? await getPageModel().insertMany(params_list, { session })
        : await getPageModel().insertMany(params_list);

      return inserted_data.map((data) => new ModelPage(data));
    } catch (error) {
      throw new Error(`新增多筆 Page 失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {PageUpdateParams} filterParams - 用於篩選的參數
   * @param {PageUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPage>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<PageUpdateParams>,
    updateParams: PageUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    try {
      const newData = await getPageModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session }
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelPage(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<PageUpdateParams>,
    updateParams: PageUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getPageModel()
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
   * @param {PageDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelPage | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: PageDeleteParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    try {
      const deletedData = await getPageModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelPage(deletedData);
    } catch (error) {
      throw error;
    }
  }

  public static async deletePage(
    Page_id: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelPage> {
    try {
      const product = await ModelProduct.get({ PageUuid: Page_id });
      if (product) {
        throw new Error("刪除失敗，該分類尚有商品");
      }

      const deletedData = await getPageModel()
        .findOneAndDelete(
          { _id: Page_id },
          {
            session,
          }
        )
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelPage(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {PageDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<PageDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: PageDeleteParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<PageDeleteResult> {
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
      const deletedData = await getPageModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getPageModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async togglePageStatus(id: string, isActive: boolean) {
    return await getPageModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
  }

  // public static async initDataForTest() {
  //   const result = await ModelPage.getData({});
  //   if (result.length) {
  //     return;
  //   }
  //   const data: PageAddParams[] = [
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
  //     await ModelPage.add({ ...item });
  //   }
  // }
}
