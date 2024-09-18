"use client";
import { api } from "@/shared/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface InitialState {
  Links: {};
  loading: boolean;
}
const initialState: InitialState = {
  Links: {},
  loading: false,
};

export const getLink = createAsyncThunk(
  "/links",
  async (_,{ rejectWithValue }) => {
    try {
      const endpoint = `/quicklinks`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLink.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLink.fulfilled, (state, action) => {
      state.loading = false;
      state.Links = action.payload;
    });
    builder.addCase(getLink.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export default linksSlice.reducer;
