"use client";
import { api } from "@/shared/api";
import {
  LoginFormValues,
  RegisterFormValues,
  ResetData,
  UpdateProfile,
  User,
  UserProfile,
} from "@/shared/types/account.types";
import { UploadFile } from "@/shared/types/profile.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

/**
 * The shape of the authentication state.
 */
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  profileData: {};
  email: string | null;
}

/**
 * The initial state for the authentication slice.
 */
const initialState: AuthState = {
  user: {
    id: null,
  },
  profileData: {},
  token: null,
  loading: false,
  error: null,
  email: null,
};

/**
 * Asynchronous thunk action for user registration.
 * 
 * @param signUpData - The data required for registration.
 * @returns The user data and token upon successful registration.
 */
export const signUp = createAsyncThunk(
  "accounts/register",
  async (signUpData: RegisterFormValues, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/register";
      const response = await api.post(endpoint, signUpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for user login.
 * 
 * @param loginData - The data required for logging in.
 * @returns The user data and token upon successful login.
 */
export const login = createAsyncThunk(
  "accounts/authenticate",
  async (loginData: LoginFormValues, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/authenticate";
      const response = await api.post(endpoint, loginData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for refreshing the user's token.
 * 
 * @returns The new token upon successful refresh.
 */
export const refreshToken = createAsyncThunk(
  "accounts/refresh-token",
  async (_, { rejectWithValue }) => {
    try {
      const endpoint = `/accounts/refresh-token`;
      const response = await api.post(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for sending a forgot password request.
 * 
 * @param gmail - The email address to send the reset link.
 * @returns The response data upon successful request.
 */
export const forgotPassword = createAsyncThunk(
  "accounts/forgot-password",
  async (gmail: string, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/forgot-password";
      const response = await api.post(endpoint, { Email: gmail });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for resetting the user's password.
 * 
 * @param resetData - The data required to reset the password.
 * @returns The response data upon successful reset.
 */
export const resetPassword = createAsyncThunk(
  "accounts/reset-password",
  async (resetData: ResetData, { rejectWithValue }) => {
    try {
      const endpoint = "/accounts/reset-password";
      const response = await api.post(endpoint, resetData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for updating the user's profile.
 * 
 * @param payload - The data required to update the user profile.
 * @returns The updated profile data upon successful update.
 */
export const userprofile = createAsyncThunk(
  "userprofile",
  async (payload: UserProfile, { rejectWithValue }) => {
    try {
      const endpoint = "/userprofile";
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for uploading files.
 * 
 * @param payload - The file data to be uploaded.
 * @returns The response data upon successful upload.
 */
export const uploadedFile = createAsyncThunk(
  "fileupload/upload_files",
  async (payload: UploadFile, { rejectWithValue }) => {
    try {
      const endpoint = "/fileupload/upload_files";
      const response = await api.post(endpoint, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for fetching a user's profile.
 * 
 * @param payload - The user ID for fetching the profile.
 * @returns The profile data upon successful fetch.
 */
export const getProfile = createAsyncThunk(
  "userprofile",
  async (payload: number, { rejectWithValue }) => {
    try {
      const endpoint = `/userprofile/${payload}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for updating a user's profile.
 * 
 * @param payload - The profile update data including user ID.
 * @returns The updated profile data upon successful update.
 */
export const updateProfile = createAsyncThunk(
  "update/userprofile",
  async (payload: UpdateProfile, { rejectWithValue }) => {
    try {
      const endpoint = `/userprofile/${payload.id}`;
      const response = await api.put(endpoint, payload.userdata);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * Asynchronous thunk action for fetching the user's email.
 * 
 * @param id - The user ID for fetching the email.
 * @returns The email associated with the user ID upon successful fetch.
 */
export const userEmail = createAsyncThunk(
  "/accounts/account_email",
  async (id: number, { rejectWithValue }) => {
    try {
      const endpoint = `/accounts/account_email?id=${id}`;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

/**
 * The authentication slice of the Redux store.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Clear the current error in the authentication state.
     */
    clearError(state) {
      state.error = null;
    },
    
    /**
     * Log out the user and reset the authentication state.
     */
    logout(state) {
      state.user = initialState.user;
      state.token = initialState.token;
      state.loading = initialState.loading;
      state.error = initialState.error;
      state.profileData = initialState.profileData;
      state.email = initialState.email;
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
        setCookie("token", token);
        setCookie("user", action.payload.userProfile);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileData = action.payload;
      })
      .addCase(userEmail.fulfilled, (state, action) => {
        state.email = action.payload;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
