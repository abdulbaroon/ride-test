"use client";
import { api } from "@/shared/api";
import { CalendarQueryParams } from "@/shared/types/calendet.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ProfileState {
  friendList: [];
  loading: boolean;
  error: string | any;
}

const initialState: ProfileState = {
  friendList: [],
  loading: false,
  error: null,
};

export const getFriends = createAsyncThunk(
  "/friend/getFriends",
  async (id: number|any, { rejectWithValue }) => {
    try {
      const endpoint = `/friend/following/${id}/friends`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const connectFriend = createAsyncThunk(
  "/friend/following",
  async (payload: any, { rejectWithValue }) => {
    try {
      const endpoint = `/friend/following`;
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeFriend = createAsyncThunk(
    "/friend/following",
    async (userProfile: any, { rejectWithValue }) => {
      try {
        const endpoint = `friend/remove_friend?userID=${userProfile?.userID}&followingID=${userProfile?.followingID}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFriends.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFriends.fulfilled, (state, action) => {
      state.loading = false;
      state.friendList = action.payload;
    });
    builder.addCase(getFriends.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default profileSlice.reducer;
