"use client";
import { api } from "@/shared/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState={
  garminAuth:{},
  rwgpsAuth:{},
  stravaAuth:{},
  RwgpsUserRoute:[],
  StravaUserRoute:[],
}
 export const authRWGPSUser = createAsyncThunk(
    "/rwgps/auth_user",
    async (params:{id:number,email:string,password:string}, { rejectWithValue }) => {
      try {
        const endpoint = `/rwgps/auth_user?userID=${params?.id}&email=${params?.email}&password=${params?.password}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const checkRWGPSUser = createAsyncThunk(
    "/rwgps/check",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/rwgps/${id}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const deleteRWGPSUser = createAsyncThunk(
    "/rwgps/delete",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/rwgps/${id}`;
        const response = await api.delete(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const authStravaUser = createAsyncThunk(
    "/strava/auth_user",
    async (params:{id:number|undefined|null,code:string}, { rejectWithValue }) => {
      try {
        const endpoint = `/strava/code_exchange?userID=${params?.id}&code=${params.code}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  ); 

  export const checkStravaUser = createAsyncThunk(
    "/strava/check", 
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/strava/${id}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const deleteStravaUser = createAsyncThunk(
    "/strava/delete",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/strava/${id}`;
        const response = await api.delete(endpoint);
        return response.data;  
      } catch (error: any) {
        return rejectWithValue(error.response.data);                                        
      }         
    }
  );

  export const getGarminCallbackUrl=createAsyncThunk(
    "/getGarminCallbackUrl",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/garmin/garmin_connect?userID=${id}`;
        const response = await api.get(endpoint);
        return response.data;  
      } catch (error: any) {
        return rejectWithValue(error.response.data);                                        
      }         
    }
  );

  export const authGarminUser = createAsyncThunk(
    "/garmin/auth_user",
    async (payload:any ,{ rejectWithValue }) => {
      try {
        const endpoint = `/garmin`;
        const response = await api.post(endpoint,payload);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  ); 
             
  export const checkGarminUser = createAsyncThunk(
    "/garmin/check",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/garmin/${id}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const deleteGarminUser = createAsyncThunk(
    "/garmin/delete",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/garmin/${id}`;
        const response = await api.delete(endpoint);
        return response.data;  
      } catch (error: any) {
        return rejectWithValue(error.response.data);                                        
      }         
    }
  );

  export const getRwgpsUserRoute=createAsyncThunk(
    "/getRwgpsUserRoute",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/rwgps/user_routes?userID=${id}`;
        const response = await api.get(endpoint);
        return response.data;  
      } catch (error: any) {
        return rejectWithValue(error.response.data);                                        
      }         
    }
  );

  export const getStravaRoute=createAsyncThunk(
    "/getStravaRoute",
    async (id:any, { rejectWithValue }) => {
      try {
        const endpoint = `/strava/user_routes?stravaID=${id}`;
        const response = await api.get(endpoint);
        return response.data;  
      } catch (error: any) {
        return rejectWithValue(error.response.data);                                        
      }         
    }
  );

const externalServices = createSlice({
    name: "externalServices",
    initialState,
    reducers: {},
    extraReducers:(builder)=> {
      builder.addCase(checkStravaUser.fulfilled,(state,action)=>{
        state.stravaAuth = action.payload;
      })
      builder.addCase(checkRWGPSUser.fulfilled,(state,action)=>{
        state.rwgpsAuth = action.payload;
      })
      builder.addCase(checkGarminUser.fulfilled,(state,action)=>{
        state.garminAuth = action.payload;
      })
      builder.addCase(getRwgpsUserRoute.fulfilled,(state,action)=>{
        state.RwgpsUserRoute = action.payload;
      })
      builder.addCase(getStravaRoute.fulfilled,(state,action)=>{
        state.StravaUserRoute = action.payload;
      })
    },
});

export default externalServices.reducer;
