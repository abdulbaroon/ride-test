"use client"
import { api } from "@/shared/api";
import { AddRidePayload, SearchRide } from "@/shared/types/addRide.types";
import { CalendarQueryParams } from "@/shared/types/calendet.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AddRideState {
  difficultyLevels: [];
  activityTypes: [];
  activityTags: [];
  hubList: [];
  searchRide:[];
  calenderData:[];
  loading: boolean;
  error: string | any;
}

const initialState: AddRideState = {
  difficultyLevels: [],
  activityTypes: [],
  activityTags: [],
  hubList: [],
  searchRide:[],
  calenderData:[],
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

export const genrateImage = createAsyncThunk(
  "activitypicture/generate_dalle",
  async (payload: {
    prompt: string,
    distance: number
  }, { rejectWithValue }) => {
    try {
      const endpoint = `activitypicture/generate_dalle`;
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const addRide = createAsyncThunk(
  "activity/activity_add",
  async (payload:unknown, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/activity_add`;
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const searchRide = createAsyncThunk(
  "activity/search",
  async (payload:SearchRide, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/search`;
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const getRide = createAsyncThunk(
  "/activity/",
  async (id:number, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const editRideApi = createAsyncThunk(
  "activity/activity_edit",
  async (payload:unknown, { rejectWithValue }) => {
    try {
      const endpoint = `/activity/activity_edit`;
      const response = await api.post(endpoint,payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)
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
      })
      .addCase(searchRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRide.fulfilled, (state, action) => {
        state.loading = false;
        state.searchRide = action.payload;
      })
      .addCase(searchRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});


export default addRideSlice.reducer;
