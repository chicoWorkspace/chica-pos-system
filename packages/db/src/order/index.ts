import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { ModelSpecInventory } from "../spec-inventory/index.model";
import { SpecInventoryBulkUpdateCustomParams } from "../spec-inventory/index.type";
import { ModelOrder } from "./index.model";
import {
  IOrder,
  OrderAddParams,
  OrderCreaterParams,
  OrderDeleteParams,
  OrderDeleteResult,
  OrderGetParams,
  OrderItemAttributes,
  orderState,
  OrderUpdateParams,
} from "./index.type";
import { ModelProduct } from "../product/index.model";
import { ModelPhoto } from "../photo/index.model";
import { ca } from "zod/v4/locales/index.cjs";
import { ModelAdmin } from "../admin/index.model";

export class Order {
  public async createOrder(params: OrderCreaterParams) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const { orderNumber, userId, paymentMethod, items, tipRate } = params;

      if (!items.every((i) => i.specId)) {
        throw new Error("有商品缺少 specId");
      }

      const specIds = items.map((item) => item.specId);
      const specList = await ModelSpecInventory.getData({ _id: specIds });

      if (specList.length !== items.length) {
        throw new Error("部分商品規格不存在");
      }

      // 準備扣庫存的更新操作
      let bulkOps: SpecInventoryBulkUpdateCustomParams[] = specList
        .map((spec) => {
          const currentItem = items.find(
            (item) => item.specId?.toString() === spec._id.toString(),
          );
          if (!currentItem) {
            return;
          }

          return {
            filter: {
              _id: spec._id,
              stock: {
                $gte: currentItem.quantity,
              }, // 需庫存足夠
            },
            updateData: {
              $inc: {
                stock: -currentItem.quantity, // 扣庫存
              },
            },
          };
        })
        .filter((op) => op !== undefined);

      // 原子執行所有扣庫存
      const result = await ModelSpecInventory.updateBulkCutom(bulkOps, session);

      // 檢查是否所有商品都扣成功
      if (result.modifiedCount !== items.length) {
        throw new Error("庫存不足或商品已變更");
      }

      let totalAmount = 0;
      let discountAmount = 0;
      let oderItems: OrderItemAttributes[] = [];
      const product = await ModelProduct.get({ _id: specList[0].productUuid });
      const photoes = await ModelPhoto.getData({ specUuid: { $in: specIds } });

      specList.map((spec) => {
        const categoryName = product?.categoryName || "";
        const categoryUuid =
          product?.categoryUuid || new mongoose.Types.ObjectId();
        const currentItem = items.find(
          (item) => item.specId.toString() == spec._id.toString(),
        );

        const currentPhoto = photoes.find(
          (photo) => photo.specUuid.toString() === spec._id.toString(),
        );

        const quantity = currentItem ? currentItem.quantity : 0;
        const subtotal = currentItem
          ? Number(currentItem.quantity) * spec.salePrice
          : 0;
        totalAmount += subtotal;

        const itemData: OrderItemAttributes = {
          specId: spec._id,
          productId: spec.productUuid,
          snapshot: {
            name: spec.name,
            categoryUuid: categoryUuid,
            categoryName: categoryName,
            photo: currentPhoto,
            price: spec.salePrice,
          },
          quantity: Number(quantity),
          subtotal: Math.floor(subtotal),
        };

        oderItems.push(itemData);
      });

      const tipAmount = Math.round(totalAmount * tipRate);
      let state: orderState = "pending";
      let paidAt: Date | undefined = undefined;
      switch (paymentMethod) {
        case "cash":
          paidAt = new Date();
          state = "paid";
          break;
        case "credit":
          break;
        case "linepay":
          break;
        default:
          break;
      }

      const admin = await ModelAdmin.get({ _id: userId });
      if (!admin) {
        throw new Error("找不到對應的管理員資料");
      }

      const order = await ModelOrder.add(
        {
          orderNumber,
          items: oderItems,
          totalAmount: totalAmount,
          discountAmount: 0,
          finalAmount: totalAmount + tipAmount,
          status: state,
          payment: {
            method: paymentMethod,
            paidAt: paidAt,
          },
          staff: {
            userId: admin._id,
            username: admin.username,
          },
        },
        session,
      );

      await session.commitTransaction();

      return order;
    } catch (err: any) {
      await session.abortTransaction();
      console.error(`❌ 訂單失敗: `, err.message);
      throw err;
    } finally {
      session.endSession();
    }
  }

  /**
   * 新增
   * @param {OrderAddParams} params - 新參數
   * @returns {Promise<ModelOrder>} - 返回信息的Promise
   * @throws {Error}
   */
  public async add(params: OrderAddParams): Promise<ModelOrder> {
    //插入資料時要轉成ObjectId
    //product_uuid: new mongoose.Types.ObjectId("64f1a2...")

    return await ModelOrder.add(params);
  }

  /**
   * 根據給定參數查找信息
   * @param {OrderGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IOrder>} - 返回信息的Promise
   * @throws {Error}
   */
  public async get(params: OrderGetParams): Promise<IOrder> {
    const info = await ModelOrder.get(params);
    if (!info) {
      throw new Error("查無");
    }
    return info;
  }

  public async getData(
    params: FilterQuery<OrderGetParams>,
    sort?: Record<string, SortOrder>,
  ): Promise<IOrder[]> {
    const list = await ModelOrder.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 根據給定參數查找信息
   * @param {OrderGetParams} params - 查找的參數，包括ID等
   * @returns {Promise<IOrder[]>} - 返回信息的Promise
   * @throws {Error}
   */
  public async list(
    params: OrderGetParams,
    sort?: { [key: string]: SortOrder },
  ): Promise<IOrder[]> {
    const list = await ModelOrder.getData(params, sort);
    if (!list) {
      throw new Error("查無");
    }
    return list;
  }

  /**
   * 編輯
   * @param {OrderUpdateParams} filterParams - 用於篩選的參數
   * @param {OrderUpdateParams} updateParams - 用於更新的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelOrder>} 更新後的資料
   * @throws {Error} 當更新失敗時拋出錯誤
   */
  public async update(
    filterParams: FilterQuery<OrderUpdateParams>,
    updateParams: OrderUpdateParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelOrder> {
    return await ModelOrder.update(filterParams, updateParams, session);
  }

  /**
   * 刪除
   * @param {OrderDeleteParams} filterParams - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<ModelOrder>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async delete(
    params: FilterQuery<OrderDeleteParams>,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelOrder> {
    return await ModelOrder.deleteOne(params, session);
  }

  /**
   * 刪除
   * @param {OrderDeleteParams} params - 用於篩選要刪除文檔的參數
   * @param {mongoose.mongo.ClientSession} [session] - 可選的 MongoDB 會話
   * @return {Promise<OrderDeleteResult>} 被刪除的文檔,如果沒有找到匹配的文檔則返回 null
   * @throws {Error} 當刪除操作失敗時拋出錯誤
   */
  public async deleteMany(
    params: OrderDeleteParams[],
    session?: mongoose.mongo.ClientSession,
  ): Promise<OrderDeleteResult> {
    return await ModelOrder.deleteMany(params, session);
  }
}
