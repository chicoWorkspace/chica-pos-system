import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { PhotoAddParams, PhotoUpdateParams } from "../photo/index.type";
import {
  SpecInventoryAddParams,
  SpecInventoryUpdateParams,
} from "../spec-inventory/index.type";
import { ModelProduct } from "./index.model";
import {
  LeanProduct,
  ProductAddParams,
  ProductDeleteParams,
  ProductDeleteResult,
  ProductGetParams,
  ProductInList,
  ProductUpdateParams,
} from "./index.type";

export class Product {
  /**
   * 新增
   * @param {ProductAddParams} params - 新參數
   * @returns {Promise<ModelProduct>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: ProductAddParams): Promise<ModelProduct> {
    return await ModelProduct.add(params);
  }

  public async createProduct(
    product: ProductAddParams,
    specInventories: SpecInventoryAddParams[],
    photos: PhotoAddParams[],
  ): Promise<ModelProduct> {
    return await ModelProduct.createProduct(product, specInventories, photos);
  }

  public async UpdateProduct(
    product: ProductUpdateParams,
    specInventories: SpecInventoryUpdateParams[],
    photos: PhotoUpdateParams[],
  ): Promise<ModelProduct> {
    return await ModelProduct.updateProduct(product, specInventories, photos);
  }

  public async deleteProduct(product_id: string): Promise<ModelProduct> {
    return await ModelProduct.deleteProduct(product_id);
  }

  /**
   * 根據給定參數查找信息
   * @param {ProductGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanProduct>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: ProductGetParams): Promise<LeanProduct> {
    const info = await ModelProduct.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  public async getData(
    params: FilterQuery<ProductGetParams>,
    sort?: Record<string, SortOrder>,
  ): Promise<ProductInList[]> {
    return ModelProduct.getProductList(params, sort);
  }

  /**
   * 根據給定參數查找信息
   * @param {ProductGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<LeanProduct[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: ProductGetParams,
    sort?: { [key: string]: SortOrder },
  ): Promise<LeanProduct[]> {
    const list = await ModelProduct.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {ProductUpdateParams} filterParams - 用於篩選的參數
   * @param {ProductUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelProduct>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<ProductUpdateParams>,
    updateParams: ProductUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelProduct> {
    return await ModelProduct.update(filterParams, updateParams, session);
  }

  /**
   * 編輯
   * @param {ProductUpdateParams} params - 用於篩選要刪除文檔的參數
   * @param {updateParams} updateParams - 更新資料,
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<{ matchedCount: number; modifiedCount: number }>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async updateMany(
    filterParams: FilterQuery<ProductUpdateParams>,
    updateParams: ProductUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    return await ModelProduct.updateMany(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {ProductDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelProduct>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<ProductDeleteParams>,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelProduct> {
    return await ModelProduct.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {ProductDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelProduct>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteMany(
    params: ProductDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<ProductDeleteResult> {
    return await ModelProduct.deleteMany(params, session);
  }
}
