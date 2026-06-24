import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { meetingApi } from './api/meetingApi';
import { aiApi } from './api/aiApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, meetingApi.middleware, aiApi.middleware),
});
