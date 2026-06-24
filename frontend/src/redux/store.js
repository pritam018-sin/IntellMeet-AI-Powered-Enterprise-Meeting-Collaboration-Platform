import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { meetingApi } from './api/meetingApi';
import { aiApi } from './api/aiApi';
import { projectApi } from './api/projectApi';
import { analyticsApi } from './api/analyticsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      meetingApi.middleware, 
      aiApi.middleware,
      projectApi.middleware,
      analyticsApi.middleware
    ),
});
