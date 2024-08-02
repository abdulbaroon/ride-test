"use client";
import { api } from "@/shared/api";
import { RideListParams } from "@/shared/types/dashboard.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  getPointLevels: {}
  pointDetails: {}
  userStats: {}
  myRideList: [];
  rideList: [];
  hotRideList: [];
  leaderBoard: [],
  loading: boolean;
  error: string | any;
  friendsCount:number
}

const initialState: DashboardState = {
  pointDetails: {},
  leaderBoard: [],
  userStats: {},
  myRideList: [],
  hotRideList: [],
  rideList: [],
  loading: false,
  error: null,
  getPointLevels: {},
  friendsCount:0,
};

export const getRideList = createAsyncThunk(
  "/activity/feed",
  async (params: RideListParams, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/feed?feedType=${params.feedType}&id=${params.id}&radius=${params.radius}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHotRideList = createAsyncThunk(
  "/activity/feed/hot",
  async (params: RideListParams, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/feed?feedType=${params.feedType}&id=${params.id}&radius=${params.radius}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getMyRideList = createAsyncThunk(
  "/activity/feed/my",
  async (params: RideListParams, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/feed?feedType=${params.feedType}&id=${params.id}&radius=${params.radius}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const postLike = createAsyncThunk(
  "activitylike",
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const endpoint = `/activitylike`;
      const response = await api.post(endpoint, payload);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getNews = createAsyncThunk(
  "/news",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/news`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserStats = createAsyncThunk(
  "/user_stats",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/userprofile/user_stats?userID=${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPointLevels = createAsyncThunk(
  "/point_levels",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/userpoint/point_levels`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPointDetails = createAsyncThunk(
  "/pointDetails",
  async (userID: Number, { rejectWithValue }) => {
    try {
      const endpoint = `/userpoint/user_points_details?id=${userID}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getLeaderBoard = createAsyncThunk(
  "/leaderboard",
  async (mode: Number, { rejectWithValue }) => {
    try {
      const endpoint = `userpoint/leaderboard?mode=${mode}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFriendCount = createAsyncThunk(
  "/friend_count",
  async (payload: {id:number,radius:number}, { rejectWithValue }) => {
    try {
      const endpoint = `friend/friend_count?userID=${payload.id}&radius=${payload.radius}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRideList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRideList.fulfilled, (state, action) => {
      state.loading = false;
      state.rideList = action.payload;
    });
    builder.addCase(getRideList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getHotRideList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getHotRideList.fulfilled, (state, action) => {
      state.loading = false;
      state.hotRideList = action.payload;
    });
    builder.addCase(getHotRideList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getMyRideList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMyRideList.fulfilled, (state, action) => {
      state.loading = false;
      state.myRideList = action.payload;
    });
    builder.addCase(getMyRideList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getUserStats.fulfilled, (state, action) => {
      state.userStats = action.payload;
    });
    builder.addCase(getPointLevels.fulfilled, (state, action) => {
      state.getPointLevels = action.payload;
    });
    builder.addCase(getPointDetails.fulfilled, (state, action) => {
      state.pointDetails = action.payload;
    });
    builder.addCase(getLeaderBoard.fulfilled, (state, action) => {
      state.leaderBoard = action.payload;
    });
    builder.addCase(getFriendCount.fulfilled,(state,action)=>{
      state.friendsCount = action.payload;
    })
  },
});

export default dashboardSlice.reducer;
