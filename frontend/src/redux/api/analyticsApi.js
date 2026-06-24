import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => '/analytics/dashboard',
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = analyticsApi;
