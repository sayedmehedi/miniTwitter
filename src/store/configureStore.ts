import { api } from "./services/api";
import rootReducer from "./rootReducer";
import { authSlice } from "./slices/auth";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { persistStore, persistReducer, } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rtkQueryErrorLogger } from "./middlewares/rtkQueryErrorLogger";
import { AppState, AppStateStatus, NativeEventSubscription } from "react-native";
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo";
import {
    FLUSH,
    PAUSE,
    PURGE,
    PERSIST,
    REGISTER,
    REHYDRATE,
} from "redux-persist";


const persistConfig = {
    key: "nextjs",
    whitelist: [authSlice.name],
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })

            .concat(api.middleware, rtkQueryErrorLogger),
});

export const persistor = persistStore(store);

let initialized = false;
setupListeners(
    store.dispatch,
    (dispatch, { onFocus, onFocusLost, onOffline, onOnline }) => {

        function defaultHandler() {
            const handleFocus = () => dispatch(onFocus());
            const handleFocusLost = () => dispatch(onFocusLost());
            const handleOnline = () => dispatch(onOnline());
            const handleOffline = () => dispatch(onOffline());
            const handleVisibilityChange = (state: AppStateStatus) => {
                if (state === "active") {
                    handleFocus();
                } else {
                    handleFocusLost();
                }
            };

            let netinfoSubscription: NetInfoSubscription | null;
            let focusSubscription: NativeEventSubscription | null;

            if (!initialized) {
                // Handle connection events
                netinfoSubscription = NetInfo.addEventListener(state => {
                    if (state.isConnected) {
                        handleOnline();
                    } else {
                        handleOffline();
                    }
                });

                focusSubscription = AppState.addEventListener(
                    "focus",
                    handleVisibilityChange,
                );
                initialized = true;
            }

            const unsubscribe = () => {
                netinfoSubscription?.();
                focusSubscription?.remove();
                initialized = false;
            };

            return unsubscribe;
        }

        return defaultHandler();
    },
);


export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;

