import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnnouncementResult } from "@repo/api-client";
import { getAnnouncementAsync } from "./announcementThunk";

export interface AnnouncementState {
  announcementList: AnnouncementResult;
  loaded: boolean;
}

export const initialState: AnnouncementState = {
  announcementList: [],
  loaded: false,
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState,
  reducers: {
    // --- 新增-
    addAnnouncements: (state, action: PayloadAction<AnnouncementResult>) => {
      // 將新收到的通知放在陣列最前面 (Unshift)
      state.announcementList = [...action.payload, ...state.announcementList];
    },
    // 清除通知
    clearAnnouncements: (state) => {
      state.announcementList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAnnouncementAsync.fulfilled, (state, action) => {
      state.announcementList = action.payload;
      state.loaded = true;
    });
  },
});
export const { addAnnouncements, clearAnnouncements } =
  announcementSlice.actions;
export const announcementReducer = announcementSlice.reducer;
