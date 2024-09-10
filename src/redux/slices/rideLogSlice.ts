import { api } from "@/shared/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  activityview: [];
  activitylog: [];
  activityrating: [];
  loading: Boolean;
  error: null | any;
}

const initialState: InitialState = {
  activityview: [],
  activitylog: [],
  activityrating: [],
  loading: false,
  error: null,
};

export const fetchActivityView = createAsyncThunk(
  "ridelog/fetchActivityView",
  async (id:number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activityview/views_per_day?id=${id}`);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchActivityLog = createAsyncThunk(
  "ridelog/fetchActivityLog",
  async (id:number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activitylog/${id}`);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchActivityRating = createAsyncThunk(
  "ridelog/fetchActivityRating",
  async (id:number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activityrating/${id}`);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const ridelogSlice = createSlice({
  name: "ridelog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityView.fulfilled, (state, action) => {
        state.loading = false;
        state.activityview = action.payload;
      })
      .addCase(fetchActivityView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActivityLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.activitylog = action.payload;
      })
      .addCase(fetchActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActivityRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityRating.fulfilled, (state, action) => {
        state.loading = false;
        state.activityrating = action.payload;
      })
      .addCase(fetchActivityRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ridelogSlice.reducer;
