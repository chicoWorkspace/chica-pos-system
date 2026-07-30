import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelProduct } from "../product/index.model";
import {
  CategoryAddParams,
  CategoryAttributes,
  CategoryDeleteParams,
  CategoryDeleteResult,
  CategoryGetParams,
  CategorySchema,
  CategoryUpdateParams,
  ICategory,
  LeanCategory,
  tableCategory,
} from "./index.type";
import { tableProduct } from "../product/index.type";

export function getCategoryModel() {
  const result =
    (mongoose.models[tableCategory] as mongoose.Model<ICategory>) ||
    mongoose.model<ICategory>(tableCategory, CategorySchema);
  return result;
}

export class ModelCategory {
  data!: ICategory;

  constructor(obj: CategoryAttributes) {
    const categoryModel = getCategoryModel();
    this.data = new categoryModel(obj);
  }

  /**
   * 取得
   * @param {CategoryGetParams} params
   * @returns {ICategory|null}
   */
  public static async get(
    params: FilterQuery<CategoryGetParams>,
  ): Promise<LeanCategory | null> {
    const find = await getCategoryModel().findOne(params).lean();
    return find;
  }

  public static async getData(
    params: FilterQuery<CategoryGetParams>,
    sort?: { [key: string]: any },
  ): Promise<LeanCategory[] | null> {
    const filter = { ...params };
    if (filter._id && Array.isArray(filter._id)) {
      filter._id = {
        $in: filter._id.map((id) => new mongoose.Types.ObjectId(id.toString())),
      };
    }

    const pipeline: any[] = [{ $match: filter }];

    if (sort && !sort.productCount) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push(
      {
        $lookup: {
          from: tableProduct,
          let: { catId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$categoryUuid", "$$catId"] },

              },
            },
            { $count: "count" },
          ],
          as: "countData",
        },
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [{ $arrayElemAt: ["$countData.count", 0] }, 0],
          },
        },
      },
      { $project: { countData: 0 } }, // 移除中間產生的暫存陣列
    );

    // 如果排序條件是針對 productCount，則必須放在這裡
    if (sort && sort.productCount) {
      pipeline.push({ $sort: sort });
    }

    const result = await getCategoryModel().aggregate(pipeline);

    return result;
  }

  /**
   * 新增
   * @param {CategoryAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelCategory} Category詳細
   */
  public static async add(
    params: CategoryAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCategory> {
    try {
      const categoryModel = getCategoryModel();
      const table = new categoryModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelCategory(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Category失敗: ${error}`);
    }
  }

  /**
   * 編輯
   * @param {CategoryUpdateParams} filterParams - 用於篩選的參數
   * @param {CategoryUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCategory>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<CategoryUpdateParams>,
    updateParams: CategoryUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCategory> {
    try {
      const newData = await getCategoryModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session },
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelCategory(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<CategoryUpdateParams>,
    updateParams: CategoryUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getCategoryModel()
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
   * @param {CategoryDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCategory | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: CategoryDeleteParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCategory> {
    try {
      const deletedData = await getCategoryModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelCategory(deletedData);
    } catch (error) {
      throw error;
    }
  }

  public static async deleteCategory(
    category_id: string,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCategory> {
    try {
      const product = await ModelProduct.get({ categoryUuid: category_id });
      if (product) {
        throw new Error("刪除失敗，該分類尚有商品");
      }

      const deletedData = await getCategoryModel()
        .findOneAndDelete(
          { _id: category_id },
          {
            session,
          },
        )
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelCategory(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {CategoryDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<CategoryDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: CategoryDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<CategoryDeleteResult> {
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
      const deletedData = await getCategoryModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getCategoryModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async toggleCategoryStatus(id: string, isActive: boolean) {
    return await getCategoryModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    );
  }

  // public static async initDataForTest() {
  //   const result = await ModelCategory.getData({});
  //   if (result.length) {
  //     return;
  //   }
  //   const data: CategoryAddParams[] = [
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
  //     await ModelCategory.add({ ...item });
  //   }
  // }
}
