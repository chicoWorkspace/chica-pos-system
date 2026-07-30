import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { sideMenuReducer } from "./sideMenuSlice";
import { cartReducer } from "./cart/cartSlice";
import { permissionReducer } from "./permission";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // 使用 localStorage
import { announcementReducer } from "./announcement/announcementSlice";

const rootReducer = (state: any, action: any) => {
 
  return combineReducers({
    announcement: announcementReducer,
    permission: permissionReducer,
    sideMenu: sideMenuReducer,
    cart: cartReducer,
  })(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["permission"],
};

const persistedRedicer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedRedicer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist 會 dispatch 非序列化的 actions，避免警告
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([]), 
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
