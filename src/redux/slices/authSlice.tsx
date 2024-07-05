"use client"
import { api } from "@/shared/api";
import { LoginFormValues, RegisterFormValues, ResetData, UpdateProfile, User, UserProfile } from "@/shared/types/account.types";
import { UploadFile } from "@/shared/types/profile.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id:null
  },
  token: null,
  loading: false,
  error: null,
};

export const signUp = createAsyncThunk(
  "accounts/register",
  async (signUpData: RegisterFormValues, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/register"
      const response = await api.post(endpoint, signUpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "accounts/authenticate",
  async (loginData: LoginFormValues, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/authenticate"
      const response = await api.post(endpoint, loginData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken= createAsyncThunk(
  "accounts/refresh-token",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/accounts/refresh-token`
      const response = await api.post(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }    
);

export const forgotPassword = createAsyncThunk(
  "accounts/forgot-password",
  async (gmail: string, { rejectWithValue }) => {
    try {
      const endpoint = "api/v4/accounts/forgot-password"
      const response = await api.post(endpoint, { Email: gmail });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "accounts/reset-password",
  async (resetData: ResetData, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/reset-password"
      const response = await api.post(endpoint, resetData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userprofile = createAsyncThunk(
  "userprofile",
  async (payload: UserProfile, { rejectWithValue }) => {
    try {
      const endpoint = "/userprofile"
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadedFile= createAsyncThunk(
  "fileupload/upload_files",
  async (payload: UploadFile, { rejectWithValue }) => {   
    try {
      const endpoint = "/fileupload/upload_files"
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProfile= createAsyncThunk(
  "userprofile",
  async (payload:number, { rejectWithValue }) => {
    try {
      const endpoint = `/userprofile/${payload}`
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }    
);


export const updateProfile = createAsyncThunk(
  "update/userprofile",
  async (payload: UpdateProfile, { rejectWithValue }) => {   
    try {
      const endpoint = `/userprofile/${payload.id}`
      const response = await api.put(endpoint, payload.userdata);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      // state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        const token = action.payload.jwtToken;
        state.loading = false;
        setCookie('token', token);
        setCookie('user',action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
