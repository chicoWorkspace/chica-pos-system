import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelSpecInventory } from "../spec-inventory/index.model";
import { ModelCart } from "./index.model";
import {
  CartAddParams,
  CartDeleteParams,
  CartDeleteResult,
  CartGetParams,
  CartResultData,
  CartUpdateParams,
  ICart,
} from "./index.type";

export class Cart {
  /**
   * 新增
   * @param {CartAddParams} params - 新參數
   * @returns {Promise<ModelCart>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: CartAddParams): Promise<ModelCart> {
    //插入資料時要轉成ObjectId
    //product_uuid: new mongoose.Types.ObjectId("64f1a2...")

    return await ModelCart.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {CartGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<ICart>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: CartGetParams): Promise<ICart> {
    const info = await ModelCart.get(params);
    if (!info) {
      throw new Error("查無購物車資料");
    }
    return info;
  }

  /**
   * 檢驗購物車內商品是否存在並刪除
   * @param {string} userId - 管理員ID
   * @returns {Promise<ICart>} - 返回信息的Promise
   * @throws {Error}
   */
  public async refreshCart(userId: string): Promise<CartResultData> {
    const objUserId = new mongoose.Types.ObjectId(userId);
    const filter: CartGetParams = {
      userId: objUserId,
    };
    const orgCart = await ModelCart.get(filter);
    const specIds = orgCart?.items.map((item) => item.specId.toString()) ?? [];
    const spceList = await ModelSpecInventory.getData({ _id: specIds });
    const specIdSet = new Set(spceList.map((s) => s._id.toString()));
    const notExist = specIds.filter((id) => !specIdSet.has(id));

    //有不存在規格要從購物車刪除
    if (notExist.length > 0) {
      const newItems = orgCart?.items.filter((item) => {
        return notExist.includes(item.specId.toString());
      });

      const newCart = await ModelCart.update(
        { userId },
        { items: newItems ?? [] },
      );
    }

    const data = await ModelCart.getCarts(filter);
    return data;
  }

  /**
   * 根據給定參數查找信息
   * @param {CartGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<ICart[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: CartGetParams,
    sort?: { [key: string]: SortOrder },
  ): Promise<ICart[]> {
    const list = await ModelCart.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 根據給定參數查找信息
   * @param {CartGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<ICart[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async carts(params: CartGetParams): Promise<CartResultData> {
    const list = await ModelCart.getCarts({});
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {CartUpdateParams} filterParams - 用於篩選的參數
   * @param {CartUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCart>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<CartUpdateParams>,
    updateParams: CartUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCart> {
    return await ModelCart.update(filterParams, updateParams, session);
  }

  /**
   * 更新購物車商品跟數量
   * @param {String} userId - 管理員ID
   * @param {String} specId - 規格ID
   * @param {Number} quantity - 要更新的數量
   * @return {Promise<ModelCart>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async cartUpdate(
    userId: string,
    specId: string,
    quantity: number,
  ): Promise<ModelCart> {
    const objUserId = new mongoose.Types.ObjectId(userId);

    const [spec, cart] = await Promise.all([
      ModelSpecInventory.get({ _id: specId }),
      ModelCart.get({ userId: objUserId }),
    ]);

    if (!spec) {
      throw new Error("查無該商品規格");
    }

    //沒有購物車就新增
    if (!cart) {
      return await ModelCart.add({
        userId: new mongoose.Types.ObjectId(userId),
        items: [
          {
            specId: spec._id,
            quantity,
          },
        ],
      });
    }

    const items = cart?.items ?? [];
    const index = items.findIndex((item) => item.specId.toString() === specId);
    if (index !== -1) {
      // 找到
      if (quantity > 0) {
        items[index].quantity = quantity; // 更新數量
      } else {
        items.splice(index, 1); // 移除項目
      }
    } else {
      // 沒找到
      if (quantity > 0) {
        items.push({
          specId: spec._id,
          quantity,
        });
      }
      // quantity <= 0 的話就不做任何事
    }

    const newCart = await ModelCart.update({ userId }, { items });
    return newCart;
  }

  /**
   * 刪除
   * @param {CartDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelCart>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<CartDeleteParams>,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelCart> {
    return await ModelCart.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {CartDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<CartDeleteResult>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteMany(
    params: CartDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<CartDeleteResult> {
    return await ModelCart.deleteMany(params, session);
  }
}
