"use client";
import { api } from "@/shared/api";
import { Hub } from "@/shared/types/hubs.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    setContact: {},
};

export const setContact = createAsyncThunk(
    "/contact",
    async (payload: any, { rejectWithValue }) => {
        try {
            const endpoint = `/contact/send_contact`;
            const response = await api.post(endpoint, payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {},
});

export default contactSlice.reducer;
