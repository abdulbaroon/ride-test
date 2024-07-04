"use client"
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

// Slices
import authReducer from "../slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
     
export const getStore = () => {
  return store; 
}      

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch