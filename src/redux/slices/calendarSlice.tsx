"use client";
import { api } from "@/shared/api";
import { CalendarQueryParams } from "@/shared/types/calendet.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Interface representing the state of calendar rides.
 */
interface CalendarRidesState {
    rides: []; // Array of rides
    loading: boolean; // Indicates loading state
    error: string | any; // Error message or object
}

/**
 * Initial state for the calendar rides slice.
 */
const initialState: CalendarRidesState = {
    rides: [],
    loading: false,
    error: null,
};

/**
 * Asynchronous thunk action to fetch calendar rides.
 * 
 * @param {CalendarQueryParams} params - The parameters for the calendar rides query.
 * @returns {Promise<any>} The rides data fetched from the API.
 */
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

/**
 * Slice for managing calendar rides state.
 */
const calendarSlice = createSlice({
    name: "calendarRides",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCalendarRides.pending, (state) => {
                state.loading = true; // Set loading to true when the request starts
            })
            .addCase(getCalendarRides.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false when the request is fulfilled
                state.rides = action.payload; // Set the rides data in state
            })
            .addCase(getCalendarRides.rejected, (state, action) => {
                state.loading = false; // Set loading to false when the request is rejected
                state.error = action.payload; // Set the error message in state
            });
    },
});

export default calendarSlice.reducer;
