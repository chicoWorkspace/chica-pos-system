import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AnnouncementGetParams,
  AnnouncementResult,
} from "@repo/api-client";
import { RootState } from "..";
import { announcementActionWrapper } from "@/src/wrappers/announcement-action-wrapper";

export const getAnnouncementAsync = createAsyncThunk<
  AnnouncementResult,
  AnnouncementGetParams,
  { state: RootState; rejectValue: string }
>("announcement/getAnnouncementAsync", async (payload, thunkAPI) => {
  try {
    const announce = await announcementActionWrapper.get(payload);

    return announce ?? [];
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Unknown error");
  }
});
