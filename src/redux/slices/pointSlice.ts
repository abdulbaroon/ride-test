// export const getRide = createAsyncThunk(
//     "/activity/",
//     async (id:number, { rejectWithValue }) => {
//       try {
//         const endpoint = `/activity/${id}`;
//         const response = await api.get(endpoint);
//         return response.data;
//       } catch (error: any) {
//         return rejectWithValue(error.response.data);
//       }
//     }
//   )

import { api } from "@/shared/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { reject } from "lodash";

interface PointState {
    pointLevel: [];
    pointType : [];
    userPoint: [];
    loading: boolean;
    error: string | any;
}

const initialState: PointState = {
    pointLevel: [],
    pointType : [],
    userPoint:[],
    loading: false,
    error: null,
};

export const getPointLevel = createAsyncThunk(
    "/PointsName",
    async (_, {rejectWithValue}) => {
        try{
            const endpoint = `/userpoint/point_levels`;
            const response = await api.get(endpoint);
            return response.data;
        }catch(error:any){
            return rejectWithValue(error.response.data)
        }
    }
)

export const getpointType = createAsyncThunk(
    "/pointType",
    async(_, {rejectWithValue}) => {
        try{
            const endpoint = `userpoint/point_types`;
            const response = await api.get(endpoint);
            return response.data;
        }catch(error:any){
            return rejectWithValue(error.response.data)
        }
    }
)

export const getUserPoint = createAsyncThunk(
    "/userPoint",
    async(params:{userID:any,mode:number}, {rejectWithValue}) => {
        try{
            const endpoint = `/userpoint/user_points?id=${params.userID}&mode=${params.mode}`;
            const response = await api.get(endpoint);
            return response.data;
        }catch(error:any){
            return rejectWithValue(error.response.data);
        }
    }
)

const pointSlice = createSlice({
    name : "point",
    initialState,
    reducers : {},
    extraReducers : ( builder ) => {
        builder.addCase(getPointLevel.fulfilled , (state, action) => {
          state.pointLevel = action.payload
        } )
        builder.addCase(getpointType.fulfilled, (state, action) =>{
            state.pointType = action.payload
        })
        builder.addCase(getUserPoint.fulfilled , (state,action) => {
            state.userPoint = action.payload
        })
    }
})


export default pointSlice.reducer
