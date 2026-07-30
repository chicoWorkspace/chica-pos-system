import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PermissionItem {
  pageKey: string;
  actions: string[];
}

interface PermissionState {
  permissions: PermissionItem[];
}

const initialState: PermissionState = {
  permissions: [],
};

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<PermissionItem[]>) => {
      state.permissions = action.payload;
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },
  },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export const permissionReducer = permissionSlice.reducer;
