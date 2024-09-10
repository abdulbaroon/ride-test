"use client";
import { api } from "@/shared/api";
import { Hub } from "@/shared/types/hubs.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface HubsState {
    hubList:[] | Hub[]
    hubs: {} | Hub;
    loading: boolean;
    hubRides:[]
    members:[]
    error: string | any;
}

const initialState: HubsState = {
    hubList:[],
    members:[],
    hubs: {},
    hubRides:[],
    loading: false,
    error: null,
};

 export const getHubsList= createAsyncThunk(
    "/activity/hubs",
    async (params:{id:number,radius:number|undefined}, { rejectWithValue }) => {
      try {
        const endpoint = `/hub/list?id=${params.id}&radius=${params.radius}`;
        const response = await api.get(endpoint);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const getHubDetails = createAsyncThunk(
    "hubs/getHubDetails",
    async (params: { hubID: number; userID: number }, { rejectWithValue }) => {
        try {
            const endpoint = `/hub/hub_detail?hubID=${params.hubID}&userID=${params.userID}`;
            const response = await api.get(endpoint);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getMemberList = createAsyncThunk(
    "hubs/getMemberList",
    async (hubID: number, { rejectWithValue }) => {
        try {
            const endpoint = `/hub/${hubID}/member_list`;
            const response = await api.get(endpoint);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getHubRideList = createAsyncThunk(
    "hubs/getRideList",
    async (params: { hubID: number; userID: number }, { rejectWithValue }) => {
        try {
            const endpoint = `/activity/hub?hubID=${params.hubID}&userID=${params.userID}`;
            const response = await api.get(endpoint);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const joinHub = createAsyncThunk(
    "hubs/joinHub",
    async (hubMember: { hubID: number | null; userID: any; hubMemberRoleID: number }, { rejectWithValue }) => {
        try {
            const endpoint = `/hub/member`;
            const response = await api.post(endpoint, hubMember);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const leaveHub = createAsyncThunk(
    "hubs/leaveHub",
    async (params:{hubID:number|null,userID:any}, { rejectWithValue }) => {
        try {
            const endpoint = `/hub/member?hubID=${params?.hubID}&userID=${params?.userID}`;
            const response = await api.delete(endpoint);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const hubsSlice = createSlice({
    name: "hubs",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getHubsList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getHubsList.fulfilled, (state, action) => {
            state.loading = false;
            state.hubList = action.payload;
        });
        builder.addCase(getHubsList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(getHubDetails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getHubDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.hubs = action.payload;
        });
        builder.addCase(getHubDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(getMemberList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getMemberList.fulfilled, (state, action) => {
            state.loading = false;
            state.members = action.payload;
        });
        builder.addCase(getMemberList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(getHubRideList.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getHubRideList.fulfilled, (state, action) => {
            state.loading = false;
            state.hubRides = action.payload;
        });
        builder.addCase(getHubRideList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default hubsSlice.reducer;
