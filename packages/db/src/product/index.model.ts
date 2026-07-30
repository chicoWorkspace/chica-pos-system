import mongoose, { FilterQuery, PipelineStage, SortOrder } from "mongoose";
import { ModelPhoto } from "../photo/index.model";
import {
  PhotoAddParams,
  PhotoBulkUpdateParams,
  PhotoUpdateParams,
  tablePhoto,
} from "../photo/index.type";
import { ModelSpecInventory } from "../spec-inventory/index.model";
import {
  SpecInventoryAddParams,
  SpecInventoryBulkUpdateParams,
  SpecInventoryUpdateParams,
  tableSpecInventory,
} from "../spec-inventory/index.type";
import {
  IProduct,
  LeanProduct,
  ProductAddParams,
  ProductAttributes,
  ProductDeleteParams,
  ProductDeleteResult,
  ProductGetParams,
  ProductInList,
  ProductSchema,
  ProductUpdateParams,
  tableProduct,
} from "./index.type";

export function getProductModel() {
  const result =
    (mongoose.models[tableProduct] as mongoose.Model<IProduct>) ||
    mongoose.model<IProduct>(tableProduct, ProductSchema);
  return result;
}

export class ModelProduct {
  data!: IProduct;

  constructor(obj: ProductAttributes) {
    const o = getProductModel();
    this.data = new o(obj);
  }

  /**
   * 取得
   * @param {ProductGetParams} params
   * @returns {IProduct|null}
   */
  public static async get(
    params: FilterQuery<ProductGetParams>
  ): Promise<LeanProduct | null> {
    const find = await getProductModel().findOne(params).lean();
    return find;
  }

  public static async getData(
    params: FilterQuery<ProductGetParams>,
    sort?: { [key: string]: SortOrder }
  ): Promise<LeanProduct[] | null> {
    if (params._id && Array.isArray(params._id)) {
      params._id = {
        $in: params._id.map((id) => new mongoose.mongo.ObjectId(id.toString())),
      };
    }

    let query = getProductModel().find(params);
    if (sort) {
      query = query.sort(sort);
    }
    return await query.lean();
  }

  public static async getProductList(
    params: FilterQuery<ProductGetParams>,
    sort?: Record<string, SortOrder>
  ) {
    const match: FilterQuery<ProductAttributes> = { ...params };

    // _id 陣列轉換 ObjectId
    if (Array.isArray(match._id)) {
      match._id = {
        $in: match._id.map((id) => new mongoose.Types.ObjectId(id.toString())),
      };
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: tableSpecInventory,
          localField: "_id",
          foreignField: "productUuid",
          as: "specInventories",
        },
      },
      {
        $lookup: {
          from: tablePhoto,
          localField: "_id",
          foreignField: "productUuid",
          as: "photos",
        },
      },
      {
        $project: {
          product: {
            $mergeObjects: [
              "$$ROOT",
              { specInventories: "$$REMOVE", photos: "$$REMOVE" },
            ],
          },
          specInventories: 1,
          photos: 1,
        },
      },
    ];

    if (sort) {
      pipeline.push({ $sort: sort } as PipelineStage);
    }

    //用泛型讓結果型別正確
    return getProductModel().aggregate<ProductInList>(pipeline).exec();
  }

  /**
   * 新增
   * @param {ProductAddParams} params
   * @param {mongoose.mongo.ClientSession} session
   * @returns {ModelProduct} Product詳細
   */
  public static async add(
    params: ProductAddParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelProduct> {
    try {
      const o = getProductModel();

      const table = new o(params);
      const newData = session
        ? await table.save({ session })
        : await table.save();

      const result = new ModelProduct(newData);
      return result;
    } catch (error) {
      throw new Error(`新增Product失敗: ${error}`);
    }
  }

  public static async createProduct(
    product: ProductAddParams,
    specInventories: SpecInventoryAddParams[],
    photos: PhotoAddParams[]
  ): Promise<ModelProduct> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. 新增 Product
      const newProduct = await ModelProduct.add(product, session);
      const productUuid = newProduct.data._id;

      // 2. 新增 SpecInventory
      const specDocs: SpecInventoryAddParams[] = specInventories.map(
        (spec) => ({
          ...spec,
          productUuid: productUuid,
        })
      );
      const newSpce = await ModelSpecInventory.addMany(specDocs, session);

      // 3. 新增 Photo
      if (photos?.length) {
        const photoDocs: PhotoAddParams[] = photos.map((photo, key) => ({
          ...photo,
          productUuid: productUuid,
          specUuid: newSpce[key].data._id,
        }));
        await ModelPhoto.addMany(photoDocs, session);
      }

      await session.commitTransaction();
      session.endSession();

      return newProduct;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("新增商品失敗:", error);
      throw new Error(error.message);
    }
  }

  /**
   * 編輯
   * @param {ProductUpdateParams} filterParams - 用於篩選的參數
   * @param {ProductUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelProduct>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public static async update(
    filterParams: FilterQuery<ProductUpdateParams>,
    updateParams: ProductUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelProduct> {
    try {
      const newData = await getProductModel()
        .findOneAndUpdate(
          filterParams,
          { $set: updateParams },
          { new: true, session }
        )
        .exec();

      if (newData === null) {
        throw new Error(`更新失敗`);
      }

      const result = new ModelProduct(newData);
      return result;
    } catch (error) {
      throw error;
    }
  }

  public static async updateProduct(
    product: ProductUpdateParams,
    specInventories: SpecInventoryUpdateParams[],
    photos: PhotoUpdateParams[]
  ): Promise<ModelProduct> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 更新主商品
      const newProduct = await ModelProduct.update(
        { _id: product._id },
        product,
        session
      );
      const productUuid = newProduct.data._id;

      //  處理規格（更新 + 新增）
      const updates: SpecInventoryBulkUpdateParams[] = [];
      const inserts: SpecInventoryAddParams[] = [];
      const markOrder: string[] = []; // 記錄 mark 對應順序

      for (const item of specInventories) {
        if (item._id) {
          updates.push({ _id: item._id, updateData: item });
        } else {
          markOrder.push(item.mark!);
          inserts.push({
            ...item,
            spec: item.spec ?? "",
            productUuid: productUuid,
            originalPrice: item.originalPrice ?? 0,
            salePrice: item.salePrice ?? 0,
            stock: item.stock ?? 0,
            cost: item.cost ?? 0,
            vipPrice: item.vipPrice ?? 0,
            name: item.name ?? "",
          });
        }
      }

      //更新現有規格
      const updatePromise = updates.length
        ? ModelSpecInventory.updateBulk(updates, session)
        : Promise.resolve();

      // 新增新規格（並取得新 id）
      const insertPromise =
        inserts.length > 0
          ? ModelSpecInventory.addMany(inserts, session)
          : Promise.resolve([]);

      const [_, insertedSpecs] = await Promise.all([
        updatePromise,
        insertPromise,
      ]);

      // 生成 Spec 對應表（給照片綁定）
      const specMap = new Map<string, string>();
      specInventories.forEach((s) => {
        if (s._id) specMap.set(s.mark!, s._id);
      });
      (insertedSpecs || []).forEach((s, index: number) => {
        const mark = markOrder[index]; // 用順序對應
        if (mark) specMap.set(mark, s.data._id.toString());
      });

      // 處理照片（更新 + 新增）
      const updatesPhoto: PhotoBulkUpdateParams[] = [];
      const insertsPhoto: PhotoAddParams[] = [];

      for (const photo of photos) {
        if (photo._id) {
          updatesPhoto.push({ _id: photo._id, updateData: photo });
        } else {
          const specId = specMap.get(photo.mark ?? "");
          insertsPhoto.push({
            productUuid: productUuid,
            specUuid: new mongoose.Types.ObjectId(specId),
            filename: photo.filename ?? "",
            alt: photo.alt ?? "",
            rank: photo.rank ?? 0,
          });
        }
      }

      await Promise.all([
        updatesPhoto.length
          ? ModelPhoto.updateBulk(updatesPhoto, session)
          : Promise.resolve(),
        insertsPhoto.length
          ? ModelPhoto.addMany(insertsPhoto, session)
          : Promise.resolve(),
      ]);

      await session.commitTransaction();
      session.endSession();

      return newProduct;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("更新商品失敗:", error);
      throw new Error(error.message);
    }
  }

  public static async updateMany(
    filterParams: FilterQuery<ProductUpdateParams>,
    updateParams: ProductUpdateParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    try {
      const updateResult = await getProductModel()
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
   * @param {ProductDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelProduct | null>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteOne(
    filterParams: ProductDeleteParams,
    session?: mongoose.mongo.ClientSession
  ): Promise<ModelProduct> {
    try {
      const deletedData = await getProductModel()
        .findOneAndDelete(filterParams, {
          session,
        })
        .exec();

      if (!deletedData) {
        throw new Error("刪除失敗，未找到匹配的文檔");
      }

      return new ModelProduct(deletedData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * 批量刪除
   * @param {ProductDeleteParams[]} filterParamsArray - 用於篩選要刪除文檔的參數數組
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ProductDeleteResult>} 刪除的文檔數量以及文檔
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public static async deleteMany(
    filterParamsArray: ProductDeleteParams[],
    session?: mongoose.mongo.ClientSession
  ): Promise<ProductDeleteResult> {
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
      const deletedData = await getProductModel()
        .find({
          $or: orConditions,
        })
        .exec();

      const result = await getProductModel()
        .deleteMany({ $or: orConditions }, { session })
        .exec();

      return { count: result.deletedCount, data: deletedData };
    } catch (error) {
      throw error;
    }
  }

  public static async deleteProduct(product_id: string): Promise<ModelProduct> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const oldProduct = await ModelProduct.deleteOne({ _id: product_id });
      await ModelSpecInventory.deleteMany([
        { productUuid: new mongoose.Types.ObjectId(product_id) },
      ]);

      await ModelPhoto.deleteMany([
        { productUuid: new mongoose.Types.ObjectId(product_id) },
      ]);

      await session.commitTransaction();
      session.endSession();

      return oldProduct;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("更新商品失敗:", error);
      throw new Error(error.message);
    }
  }

  public static async toggleProductStatus(id: string, isActive: boolean) {
    return await getProductModel().findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
  }
}
