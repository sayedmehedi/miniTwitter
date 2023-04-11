import { api } from "./services/api";
import { authSlice } from "./slices/auth";
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  [api.reducerPath]: api.reducer,
  [authSlice.name]: authSlice.reducer,
});
