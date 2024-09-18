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
  responsetype:[]
}

const initialState: RideDetailState = {
  rides: {},
  weather: {},
  route:{},
  activityChat: [],
  loading: false,
  error: null,
  rosterDetails: [],
  friendsList:[],
  responsetype:[]
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

export const getresponsetype = createAsyncThunk(
  "/activityroster",
  async (_, { rejectWithValue}) => {
    try {
      const endpoint = `/responsetype`
      const response = await api.get(endpoint);
      return response.data;
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
    // Handle getRideDetails API loading
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

    // Handle getWeather API loading
    builder.addCase(getWeather.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getWeather.fulfilled, (state, action) => {
      state.loading = false;
      state.weather = action.payload;
    });
    builder.addCase(getWeather.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle activityView API loading
    builder.addCase(activityView.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(activityView.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(activityView.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getChatActivity API loading
    builder.addCase(getChatActivity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getChatActivity.fulfilled, (state, action) => {
      state.loading = false;
      state.activityChat = action.payload;
    });
    builder.addCase(getChatActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle setChatActivity API loading
    builder.addCase(setChatActivity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setChatActivity.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(setChatActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle deleteChatActivity API loading
    builder.addCase(deleteChatActivity.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteChatActivity.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteChatActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getActivityRoster API loading
    builder.addCase(getActivityRoster.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getActivityRoster.fulfilled, (state, action) => {
      state.loading = false;
      state.rosterDetails = action.payload;
    });
    builder.addCase(getActivityRoster.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle setActivityRoster API loading
    builder.addCase(setActivityRoster.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(setActivityRoster.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(setActivityRoster.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getShareImage API loading
    builder.addCase(getShareImage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getShareImage.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getShareImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getActivityroute API loading
    builder.addCase(getActivityroute.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getActivityroute.fulfilled, (state, action) => {
      state.loading = false;
      state.route = action.payload;
    });
    builder.addCase(getActivityroute.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getFriendsList API loading
    builder.addCase(getFriendsList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFriendsList.fulfilled, (state, action) => {
      state.loading = false;
      state.friendsList = action.payload;
    });
    builder.addCase(getFriendsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getresponsetype API loading
    builder.addCase(getresponsetype.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getresponsetype.fulfilled, (state, action) => {
      state.loading = false;
      state.responsetype = action.payload;
    });
    builder.addCase(getresponsetype.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default rideDetailSlice.reducer;

