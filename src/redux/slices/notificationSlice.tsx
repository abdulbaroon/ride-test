"use client";
import { api } from "@/shared/api";
import { CalendarQueryParams } from "@/shared/types/calendet.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface NotificationState {
  notifications: [];
  loading: boolean;
  error: string | any;
  AllNotifications: [];
  userNotification:{}
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  AllNotifications: [],
  userNotification:{}
};

export const getNotifications = createAsyncThunk(
  "/notifications/user_list",
  async (
    params: { id: number; isRead: boolean; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = `/notifications/user_list?userID=${params.id}&isRead=${params.isRead}&limit=${params.limit}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markNotification = createAsyncThunk(
  "/notifications/mark_single_read",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/notifications/mark_single_read?notificationID=${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markAllNotification = createAsyncThunk(
  "/notifications/mark_read",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/notifications/mark_read?userID=${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllNotification = createAsyncThunk(
  "notifications/user_list_all",
  async (params: { id: number; limit: number }, { rejectWithValue }) => {
    try {
      const endpoint = `notifications/user_list_all?userID=${params.id}&limit=${params.limit}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserNotification = createAsyncThunk(
  "usernotification/get",
  async (id:number, { rejectWithValue }) => {
    try {
      const endpoint = `usernotification/${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateUserNotification = createAsyncThunk(
  "usernotification/put",
  async (payload:any, { rejectWithValue }) => {
    try {
      const endpoint = `usernotification/${payload.userID}`;
      const response = await api.put(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getAllNotification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllNotification.fulfilled, (state, action) => {
      state.loading = false;
      state.AllNotifications = action.payload;
    });
    builder.addCase(getAllNotification.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getUserNotification.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(getUserNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.userNotification = action.payload;
      });
      builder.addCase(getUserNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
