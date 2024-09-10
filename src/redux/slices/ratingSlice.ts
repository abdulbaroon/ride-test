import { api } from "@/shared/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  garminAuth: {},
};
export const checkUserInRide = createAsyncThunk(
  "/userprofile/userinride",
  async (params:{activityID:number,userID:number}, { rejectWithValue }) => {
    try {
      const endpoint = `/userprofile/userinride?activityID=${params.activityID}&userID=${params.userID}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const checkUserRating = createAsyncThunk(
    "/activityrating/rating_check",
    async (params: {activityID:number,userID:number}, { rejectWithValue }) => {
      try {
        const endpoint = `/activityrating/rating_check?activityID=${params.activityID}&userID=${params.userID}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const setActivityrating = createAsyncThunk(
    "/activityrating",
    async (payload: any, { rejectWithValue }) => {
      try {
        const endpoint = `/activityrating`;
        const response = await api.post(endpoint,payload);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );


const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {},
});

export default ratingSlice.reducer;
