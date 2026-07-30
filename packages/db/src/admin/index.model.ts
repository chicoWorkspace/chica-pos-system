import mongoose, { FilterQuery, SortOrder } from "mongoose";
import AdminModel, {
  AdminAddParams,
  AdminAttributes,
  AdminGetParams,
  AdminSchema,
  AdminUpdateParams,
  IAdminDocument,
} from "./index.type";

export class ModelAdmin {
  data!: IAdminDocument;
  constructor(attributes: IAdminDocument) {
    this.data = new AdminModel(attributes);
  }

  /**
   * 新增
   * @param {AdminAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelAdmin} Admin詳細
   */
  public static async add(
    params: AdminAddParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelAdmin> {
    try {
      const table = new AdminModel(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelAdmin(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Admin失敗: ${error}`);
    }
  }

  /**
   * 取得單筆資料
   * @param {FilterQuery<AdminGetParams>} filter - 查詢條件
   * @returns {Promise<IAdmin | null>} - 匹配的資料或 null
   */
  public static async get(
    filter: FilterQuery<AdminGetParams>
  ): Promise<IAdminDocument | null> {
    return AdminModel.findOne(filter).exec();
  }

  /**
   * 取得多筆資料
   * @param {FilterQuery<AdminGetParams>} filter - 查詢條件
   * @param {Record<string, SortOrder>} [sort] - 排序條件
   * @returns {Promise<IAdmin[]>} - 匹配的資料陣列
   */
  public static async getData(
    filter: FilterQuery<AdminGetParams>,
    sort?: Record<string, SortOrder>
  ): Promise<IAdminDocument[]> {
    if (filter._id && Array.isArray(filter._id)) {
      filter._id = {
        $in: filter._id.map((id) => new mongoose.Types.ObjectId(id.toString())),
      };
    }

    let query = AdminModel.find(filter);
    if (sort) {
      query = query.sort(sort);
    }

    return query.exec();
  }

  /**
   * 編輯
   * @param {AdminUpdateParams} filterParams - 用於篩選的參數
   * @param {AdminUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelAdmin>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: AdminUpdateParams,
    updateParams: AdminUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelAdmin> {
    try {
      const newData = await AdminModel.findOneAndUpdate(
        filterParams,
        { $set: updateParams },
        { new: true, session }
      ).exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelAdmin(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
