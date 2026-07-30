import {
  CartUpdateParams as apiCartUpdateParams,
  CartDeleteParams,
  CartItem,
  CartResult,
  CartTableResult,
} from "@repo/api-client";
import { Cart } from "@repo/db";
import { CartGetParams } from "@repo/db";
import { Photo } from "@repo/db";
import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../auth/authMiddleware";
import { AuthRequest } from "../types";
import { Product } from "@repo/db";
import { PhotosProps } from "@repo/api-client";

const router = Router();

// router.post("/order", authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction(); // 🔒 開啟交易（確保原子性）

//   try {
//     const userId = req.user._id;

//     // 1️⃣ 取得購物車內容
//     const cart = await Cart.findOne({ userId }).populate("items.productId");
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "購物車是空的" });
//     }

//     // 2️⃣ 驗證商品庫存與價格
//     let totalAmount = 0;
//     const orderItems = [];

//     for (const item of cart.items) {
//       const product = item.productId;
//       if (!product) throw new Error("商品不存在");

//       // (A) 驗證庫存
//       if (product.stock < item.quantity) {
//         throw new Error(`商品 ${product.name} 庫存不足`);
//       }

//       // (B) 驗證價格（避免前端竄改）
//       const currentPrice = product.price;

//       // 計算總金額
//       totalAmount += currentPrice * item.quantity;

//       // 建立訂單商品快照
//       orderItems.push({
//         productId: product._id,
//         name: product.name,
//         quantity: item.quantity,
//         priceAtPurchase: currentPrice,
//       });

//       // (C) 鎖定庫存：減掉購買數量
//       await Product.updateOne(
//         { _id: product._id, stock: { $gte: item.quantity } },
//         { $inc: { stock: -item.quantity } }, // 庫存扣除
//         { session }
//       );
//     }

//     // 3️⃣ 建立訂單
//     const newOrder = await Order.create(
//       [
//         {
//           userId,
//           items: orderItems,
//           totalAmount,
//         },
//       ],
//       { session }
//     );

//     // 4️⃣ 清空購物車
//     await Cart.updateOne({ userId }, { $set: { items: [] } }, { session });

//     // 5️⃣ 提交交易
//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({
//       message: "訂單建立成功",
//       order: newOrder[0],
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(400).json({ message: err.message });
//   }
// });


export { router as OrderRouter };
