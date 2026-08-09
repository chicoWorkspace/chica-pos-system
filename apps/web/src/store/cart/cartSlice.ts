import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PhotosProps, SpecInventoriesProps } from "@repo/api-client";
import {
  addCartAsync,
  decreaseCartAsync,
  deleteCartAsync,
  getCartAsync,
  addApiCartAsync,
  decreaseApiCartAsync,
  deleteApiCartAsync,
  clearApiCartAsync,
} from "./cartThunk";
import { CartTableResult } from "@repo/api-client";

export interface AddToCartPayload {
  product: SpecInventoriesProps;
  quantity: number;
}
export interface CartItem extends SpecInventoriesProps {
  quantity: number;
}
export interface CartState {
  products: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  cartLoaded: boolean;
  isUpdating: boolean;
}
export const initialState: CartState = {
  products: [],
  status: "idle",
  cartLoaded: false,
  isUpdating: false,
};

// 這裡可以添加一個初始的購物車數據獲取函數
// export const fetchInitialCart = createAsyncThunk(
//   "cart/fetchInitialCart",
//   async () => {
//     const response = await axios.get("/api/cart"); // 你自己的 API 路徑
//     return response.data; // 假設是一個 ProductProps[] 陣列
//   }
// );

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 添加商品到購物車
    addCart(
      state: { products: CartItem[] },
      action: PayloadAction<AddToCartPayload>,
    ) {
      const { product, quantity = 1 } = action.payload;

      const existing = state.products.find(
        (item) => item._id.toString() === product._id.toString(),
      );

      const maxAvailable = product.stock ?? Infinity;

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        existing.quantity =
          newQuantity > maxAvailable ? maxAvailable : newQuantity;
      } else {
        const initialQuantity =
          quantity > maxAvailable ? maxAvailable : quantity;
        state.products.push({ ...product, quantity: initialQuantity });
      }
    },
    // 減少商品數量
    decreaseCart(state, action: PayloadAction<string>) {
      const item = state.products.find(
        (item) => item._id.toHexString() === action.payload,
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.products = state.products.filter(
            (i) => i._id.toString() !== action.payload,
          );
        }
      }
    },
    // 刪除購物車中的商品
    deletCart(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        (item) => item._id.toString() !== action.payload,
      );
    },
    // 清空購物車
    clearCart(state) {
      state.products = [];
    },
  },
  // 這裡處理異步操作的結果，例如從 API 獲取購物車數據、添加商品到購物車等
  extraReducers: (builder) => {
    builder
      /*------------------------------*/
      /* 本地端實現購物車 */
      .addCase(addCartAsync.fulfilled, (state, action) => {
        const { product, quantity } = action.payload;

        const existing = state.products.find(
          (item) => item._id.toString() === product._id.toString(),
        );

        const maxAvailable = product.stock ?? Infinity;

        if (existing) {
          const newQuantity = existing.quantity + quantity;
          existing.quantity =
            newQuantity > maxAvailable ? maxAvailable : newQuantity;
        } else {
          const initialQuantity =
            quantity > maxAvailable ? maxAvailable : quantity;
          state.products.push({ ...product, quantity: initialQuantity });
        }
      })
      // 減少商品數量
      .addCase(decreaseCartAsync.fulfilled, (state, action) => {
        const item = state.products.find(
          (item) => item._id.toString() === action.payload,
        );
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.products = state.products.filter(
              (i) => i._id.toString() !== action.payload,
            );
          }
        }
      })
      .addCase(deleteCartAsync.fulfilled, (state, action) => {
        state.products = [];
      })

      /*------------------------------*/
      /* API實現購物車 */
      //向api[取得]購物車資料

      .addCase(getCartAsync.fulfilled, (state, action) => {
        const items = action.payload.items;
        state.products = items;
        state.cartLoaded = true;
      })
      //向api[新增]購物車資料
      .addCase(addApiCartAsync.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(addApiCartAsync.fulfilled, (state, action) => {
        const items = action.payload.items;
        state.products = items;
        state.isUpdating = false;
      })
      //向api[減少]購物車資料
      .addCase(decreaseApiCartAsync.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(decreaseApiCartAsync.fulfilled, (state, action) => {
        const items = action.payload.items;
        state.products = items;
        state.isUpdating = false;
      })
      //向api[刪除]購物車資料
      .addCase(deleteApiCartAsync.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(deleteApiCartAsync.fulfilled, (state, action) => {
        const items = action.payload.items;
        state.products = items;
        state.isUpdating = false;
      })
      .addCase(clearApiCartAsync.fulfilled, (state) => {
        state.products = [];
      })
      .addCase(clearApiCartAsync.pending, (state) => {
        state.isUpdating = true;
      });

    //     builder
    //       .addCase(fetchInitialCart.pending, (state) => {
    //         state.status = "loading";
    //       })
    //       .addCase(fetchInitialCart.fulfilled, (state, action) => {
    //         state.status = "succeeded";
    //         state.products = action.payload;
    //       })
    //       .addCase(fetchInitialCart.rejected, (state) => {
    //         state.status = "failed";
    //       });
  },
});

function formatCart(specList: CartTableResult) {}

export const { addCart, decreaseCart, deletCart, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
