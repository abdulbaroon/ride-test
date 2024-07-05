"use client"
import { api } from "@/shared/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AddRideState {
  difficultyLevels: [];
  activityTypes: [];
  activityTags: [];
  hubList: [];
  loading: boolean;
  error: string | any;
}

const initialState:AddRideState = {       
  difficultyLevels: [],
  activityTypes: [],
  activityTags: [],
  hubList: [],
  loading: false,
  error: null
};

export const getDifficultyLevel = createAsyncThunk(
  "addRide/getDifficultyLevel",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/difficultylevel`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getActivityType = createAsyncThunk(
  "addRide/getActivityType",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/activitytype`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getActivityTag = createAsyncThunk(
  "addRide/getActivityTag",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/activitytag/cloud`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHubList = createAsyncThunk(
  "addRide/getHubList",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/hub/list?id=33&radius=200`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addRideSlice = createSlice({
  name: "addRide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDifficultyLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDifficultyLevel.fulfilled, (state, action) => {
        state.loading = false;
        state.difficultyLevels = action.payload;
      })
      .addCase(getDifficultyLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getActivityType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityType.fulfilled, (state, action) => {
        state.loading = false;
        state.activityTypes = action.payload;
      })
      .addCase(getActivityType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getActivityTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityTag.fulfilled, (state, action) => {
        state.loading = false;
        state.activityTags = action.payload;
      })
      .addCase(getActivityTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHubList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHubList.fulfilled, (state, action) => {
        state.loading = false;
        state.hubList = action.payload;
      })
      .addCase(getHubList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default addRideSlice.reducer;
