import { api } from "../services/api";
import { RootState } from "../configureStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null as string | null,
  },
  reducers: {
    tokenReceived(
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string;
      }>
    ) {
      state.token = action.payload.access_token;
    },
    loggedOut(state) {
      state.token = null;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
      state.token = action.payload.token;
    });
  },
});

export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const { loggedOut, tokenReceived } = authSlice.actions;
