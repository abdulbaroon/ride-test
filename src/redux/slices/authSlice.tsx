"use client"
import { api } from "@/shared/api";
import { LoginFormValues, RegisterFormValues, ResetData } from "@/shared/types/account.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

interface AuthState {
  user: any | null; 
  token: string | null;
  loading: boolean;
  error: string | null;
  currentUser: any | null; 
}

const initialState:AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  currentUser: null,
};

export const signUp = createAsyncThunk(
  "accounts/register",
  async (signUpData:RegisterFormValues, { rejectWithValue }) => {
    try {
      const endpoint = "/api/v4/accounts/register"
      const response = await api.post(endpoint, signUpData);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "accounts/authenticate",
  async (loginData:LoginFormValues, { rejectWithValue }) => {
    try {
      const endpoint = "/api/v4/accounts/authenticate"
      const response = await api.post(endpoint, loginData);
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "accounts/forgot-password",
  async (gmail:string, { rejectWithValue }) => {
    try {
      const endpoint = "api/v4/accounts/forgot-password"
      const response = await api.post(endpoint, {Email:gmail});
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "accounts/reset-password",
  async (resetData:ResetData, { rejectWithValue }) => {
    try {
      const endpoint = "/api/v4/accounts/reset-password"
      const response = await api.post(endpoint,resetData);
      return response.data;
    } catch (error:any) {
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
      state.user = null;
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
        state.error = action.payload  as string | null;
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload  as string | null ;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
