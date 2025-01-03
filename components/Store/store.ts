import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import registerProvider from "../Context/registerProvider";
import locationProvider from "../Context/locationProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authProvider from "../Context/authProvider";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["registerProvider", "location", "auth"],
};

const rootReducer = combineReducers({
  registerProvider: registerProvider,
  locationProvider: locationProvider,
  authProvider: authProvider
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer types for use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
