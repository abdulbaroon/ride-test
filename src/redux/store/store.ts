import storage from "../../shared/util/storage.util";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "../slices/authSlice";
import addRideReducer from "../slices/addRideSlice";
import calendarReducer from "../slices/calendarSlice";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "addRide", "calendar"],
};

const rootReducer = combineReducers({
    auth: authReducer,
    addRide: addRideReducer,
    calendar: calendarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
