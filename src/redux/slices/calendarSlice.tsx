"use client";
import { api } from "@/shared/api";
import { CalendarQueryParams } from "@/shared/types/calendet.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface CalendarRidesState {
    rides: [];
    loading: boolean;
    error: string | any;
}

const initialState: CalendarRidesState = {
    rides: [],
    loading: false,
    error: null,
};

 export const getCalendarRides = createAsyncThunk(
    "/activity/calendar",
    async (params: CalendarQueryParams, { rejectWithValue }) => {
      try {
        const endpoint = `/activity/calendar?id=${params.id}&radius=${params.radius}&startDate=${params.startDate}&endDate=${params.endDate}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const calendarSlice = createSlice({
    name: "calendarRides",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCalendarRides.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCalendarRides.fulfilled, (state, action) => {
            state.loading = false;
            state.rides = action.payload;
        });
        builder.addCase(getCalendarRides.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default calendarSlice.reducer;
