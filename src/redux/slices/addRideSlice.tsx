"use client"
import { api } from "@/shared/api";
import { LoginFormValues, RegisterFormValues, ResetData, UpdateProfile, User, UserProfile } from "@/shared/types/account.types";
import { UploadFile } from "@/shared/types/profile.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";



const initialState = {
  
};
export const getDifficultyLevel= createAsyncThunk(
    "difficultylevel",
    async (_,{ rejectWithValue }) => {
      try {
        const endpoint = `/difficultylevel`
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
  reducers: {
  }
});


export default addRideSlice.reducer;
