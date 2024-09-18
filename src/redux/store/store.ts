import storage from "../../shared/util/storage.util";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "../slices/authSlice";
import addRideReducer from "../slices/addRideSlice";
import calendarReducer from "../slices/calendarSlice";
import dashboardReducer from "../slices/dashboardSlice";
import rideDetailReducer from "../slices/rideDetailsSlice";
import externalServicesReducer from "../slices/externalServicesSlice";
import hubsSliceReducer from "../slices/hubsSlice";
import notificationReducer from "../slices/notificationSlice";
import pointReducer from "../slices/pointSlice";
import profileReducer from "../slices/profileSlice";
import ratingReducer from "../slices/ratingSlice";
import ridelogReducer from "../slices/rideLogSlice";
import contactSlice from "../slices/contactSlice";
import linksReducer from "../slices/linksSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "addRide",
    "calendar",
    "dashboard",
    "rideDetail",
    "externalServices",
    "hubs",
    "notification",
    "point",
    "profile",
    //"ridelog",
    "contact",
  ],
};

const rootReducer = combineReducers({
  auth: authReducer,
  addRide: addRideReducer,
  calendar: calendarReducer,
  dashboard: dashboardReducer,
  rideDetail: rideDetailReducer,
  externalServices: externalServicesReducer,
  hubs: hubsSliceReducer,
  notification: notificationReducer,
  point: pointReducer,
  profile: profileReducer,
  rating: ratingReducer,
  ridelog: ridelogReducer,
  contact: contactSlice,
  links: linksReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "rideDetails/getShareImage/fulfilled",
        ],
        ignoredPaths: ["rideDetails.imageBlob"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
