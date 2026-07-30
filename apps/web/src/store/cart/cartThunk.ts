import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddToCartPayload, CartState } from "./cartSlice";
import { RootState } from "..";
import { getCartApi } from "@/src/api-client/cart";
import { cartActionWrapper } from "@/src/wrappers/cart-action-wrapper";
import {
  CartResult,
  CartTableResult,
} from "@repo/api-client";

// export const fetchProducts = createAsyncThunk<Product[]>(
//   "products/fetch",
//   async (_, thunkAPI) => {
//     try {
//       const res = await axios.get<Product[]>("https://fakestoreapi.com/products");
//       return res.data; // 這會成為 fulfilled 的 payload
//     } catch (err: any) {
//       // 可以客製錯誤訊息並用 rejectWithValue 傳回
//       return thunkAPI.rejectWithValue(err.response?.data || err.message || "Unknown error");
//     }
//   }
// );

/*------------------------------
/* 本地端實現購物車 
/*------------------------------
*/
// 異步操作：添加商品到購物車
export const addCartAsync = createAsyncThunk<
  AddToCartPayload, // 回傳值（fulfilled 用）
  AddToCartPayload, // 傳入值
  { state: RootState; rejectValue: string }
>("cart/addCartAsync", async (payload, thunkAPI) => {
  const { product, quantity } = payload;
  const state = thunkAPI.getState();
  const existing = state.cart.products.find(
    (item) => item._id.toString() === product._id.toString()
  );

  const maxAvailable = product.stock ?? Infinity;
  const currentQty = existing?.quantity ?? 0;
  const newQty = currentQty + quantity;

  if (newQty > maxAvailable) {
    return thunkAPI.rejectWithValue("已達庫存上限");
  }

  return payload;
});

// 異步操作： 減少商品數量
export const decreaseCartAsync = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("cart/decreaseCart", async (product_uuid, thunkAPI) => {
  const state = thunkAPI.getState();
  const item = state.cart.products.find(
    (item) => item._id.toString() === product_uuid
  );

  if (!item) {
    return thunkAPI.rejectWithValue("商品不存在");
  }

  return product_uuid;
});

export const deleteCartAsync = createAsyncThunk<
  string, // Return type (fulfilled)
  string, // Argument type (productUuid)
  { state: RootState; rejectValue: string }
>("cart/deleteCart", async (productUuid, thunkAPI) => {
  const state = thunkAPI.getState();
  const item = state.cart.products.find(
    (item) => item._id.toString() === productUuid
  );

  if (!item) {
    return thunkAPI.rejectWithValue("商品不存在");
  }

  return productUuid;
});

/*------------------------------
/* API實現購物車 
/*------------------------------
*/
export const getCartAsync = createAsyncThunk<
  CartTableResult, // 回傳值（fulfilled 用）
  void, // 傳入值
  { state: RootState; rejectValue: string }
>("cart/getCartAsync", async (_, thunkAPI) => {
  try {
    const cart = await cartActionWrapper.get();
    return cart as CartTableResult;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Unknown error"
    ) as ReturnType<typeof thunkAPI.rejectWithValue>; // 明確轉型，避免 undefined
  }
});

export const addApiCartAsync = createAsyncThunk<
  CartTableResult, // 回傳值（fulfilled 用）
  AddToCartPayload, // 傳入值
  { state: RootState; rejectValue: string }
>("cart/addApiCartAsync", async (payload, thunkAPI) => {
  try {
    const { product, quantity } = payload;
    const state = thunkAPI.getState();
    const existing = state.cart.products.find(
      (item) => item._id.toString() === product._id.toString()
    );

    const maxAvailable = product.stock ?? Infinity;
    const currentQty = existing?.quantity ?? 0;
    const newQty = currentQty + quantity;

    if (newQty > maxAvailable) {
      return thunkAPI.rejectWithValue("已達庫存上限");
    }

    const cart = await cartActionWrapper.update(product._id.toString(), {
      quantity: newQty,
    });
    return cart as CartTableResult;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Unknown error"
    ) as ReturnType<typeof thunkAPI.rejectWithValue>; // 明確轉型，避免 undefined
  }
});

export const decreaseApiCartAsync = createAsyncThunk<
  CartTableResult, // 回傳值（fulfilled 用）
  string, // 傳入值
  { state: RootState; rejectValue: string }
>("cart/decreaseApiCartAsync", async (specId, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const item = state.cart.products.find(
      (item) => item._id.toString() === specId
    );

    if (!item) {
      return thunkAPI.rejectWithValue("商品不存在");
    }

    const newQty = item.quantity - 1;
    const cart = await cartActionWrapper.update(item._id.toString(), {
      quantity: newQty,
    });

    return cart as CartTableResult;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Unknown error"
    ) as ReturnType<typeof thunkAPI.rejectWithValue>; // 明確轉型，避免 undefined
  }
});

export const deleteApiCartAsync = createAsyncThunk<
  CartTableResult, // 回傳值（fulfilled 用）
  string, // Argument type (specId)
  { state: RootState; rejectValue: string }
>("cart/deleteApiCartAsync", async (specId, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const item = state.cart.products.find(
      (item) => item._id.toString() === specId
    );

    if (!item) {
      return thunkAPI.rejectWithValue("商品不存在");
    }
    
    const cart = await cartActionWrapper.deleteSpec(item._id.toString());
    return cart as CartTableResult;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Unknown error"
    ) as ReturnType<typeof thunkAPI.rejectWithValue>; // 明確轉型，避免 undefined
  }
});
