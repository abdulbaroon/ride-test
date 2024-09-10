"use client";
import { api } from "@/shared/api";
import { ActivityChatPayload, ActivityRoster, ActivityRoute, RosterDetail, UserFollowingData } from "@/shared/types/rideDetail.types";
import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";

interface RideDetailState {
  rides: {};
  weather: {};
  activityChat: [];
  loading: boolean;
  error: string | any;
  rosterDetails: RosterDetail[] | []
  route:ActivityRoute | {}
  friendsList:[]|UserFollowingData[]
}

const initialState: RideDetailState = {
  rides: {},
  weather: {},
  route:{},
  activityChat: [],
  loading: false,
  error: null,
  rosterDetails: [],
  friendsList:[]
};

export const getRideDetails = createAsyncThunk(
  "/activity/",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getWeather = createAsyncThunk(
  "weather",
  async (params: { date: string, lat: number | undefined, lng: number | undefined, uom: number }, { rejectWithValue }) => {
    try {
      const endpoint = `weather/ride_detail?activityDateTime=${params.date}&lat=${params.lat}&lng=${params.lng}&uom=${params.uom}`
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const activityView = createAsyncThunk(
  "activityview",
  async (payload: { activityID: number, createdBy: number|null|undefined, createdDate: string }, { rejectWithValue }) => {
    try {
      const endpoint = `/activityview`
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getChatActivity = createAsyncThunk(
  "activitychat",
  async (params: { activityID: number, userID: number | null | undefined }, { rejectWithValue }) => {
    try {
      const endpoint = `/activitychat/activity_thread?activityID=${params.activityID}&userID=${params.userID}`
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const setChatActivity = createAsyncThunk(
  "setActivitychat",
  async (payload: ActivityChatPayload, { rejectWithValue }) => {
    try {
      const endpoint = `/activitychat`
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const deleteChatActivity = createAsyncThunk(
  "deleteActivitychat",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/activitychat/${id}`
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getActivityRoster = createAsyncThunk(
  "getActivityRoster",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/activityroster/${id}`
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const setActivityRoster = createAsyncThunk(
  "setActivityRoster",
  async (payload: ActivityRoster, { rejectWithValue, dispatch }) => {
    try {
      const endpoint = `/activityroster`
      const response = await api.post(endpoint, payload);
      dispatch(getRideDetails(payload.activityID))
      dispatch(getActivityRoster(payload.activityID))
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)


export const getShareImage = createAsyncThunk(
  "share_image",
  async (params:{activityID:number,imageType:string,imageStyle:string} , { rejectWithValue }) => {
    try {
      const endpoint = `/mapboxhelper/share_image?activityID=${params.activityID}&imageType=${params.imageType}&imageStyle=${params.imageStyle}`
      const response = await api.get(endpoint,
       { responseType: 'blob'}
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getActivityroute = createAsyncThunk(
  "activityroute",
  async (id:number , { rejectWithValue}) => {
    try {
      const endpoint = `/activityroute/${id}`
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getFriendsList = createAsyncThunk(
  "following/activity_invite_list",
  async (params:{id:number|any,activityID:number} , { rejectWithValue}) => {
    try {
      const endpoint = `/friend/following/activity_invite_list?activityID=${params?.activityID}&userID=${params?.id}`
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const setBulkActivityRoster = createAsyncThunk(
  "/activityroster/bulk_roster",
  async (payload: any[], { rejectWithValue, dispatch }) => {
    try {
      await Promise.all(payload.map(data => dispatch(setActivityRoster(data))));
      return true;
    } catch (error: any) {
      console.error("Failed to process bulk activity roster:", error);
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);


const rideDetailSlice = createSlice({
  name: "rideDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRideDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRideDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.rides = action.payload;
    });
    builder.addCase(getRideDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getWeather.fulfilled, (state, action) => {
      state.weather = action.payload;
    });
    builder.addCase(getChatActivity.fulfilled, (state, action) => {
      state.activityChat = action.payload;
    });
    builder.addCase(getActivityRoster.fulfilled, (state, action) => {
      state.rosterDetails = action.payload;
    });
    builder.addCase(getActivityroute.fulfilled, (state, action) => {
      state.route = action.payload;
    });
    builder.addCase(getFriendsList.fulfilled, (state, action) => {
      state.friendsList = action.payload;
    });
  },
});

export default rideDetailSlice.reducer;
