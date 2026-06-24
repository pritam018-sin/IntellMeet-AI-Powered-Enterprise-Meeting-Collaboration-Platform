import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials } from '../slices/authSlice';
import { API_BASE_URL } from '../../constants';

// 1. Create a base query instance
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL, 
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// 2. Wrap it with our custom re-auth logic
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized or 402 Payment Required (backend uses 402 for invalid token)
  if (result.error && (result.error.status === 401 || result.error.status === 402)) {
    const refreshToken = api.getState().auth.refreshToken;
    
    if (refreshToken) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        {
          url: '/users/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Assume the backend returns { data: { accessToken, refreshToken } } or similar
        const newAccessToken = refreshResult.data.data?.accessToken || refreshResult.data.accessToken;
        const newRefreshToken = refreshResult.data.data?.refreshToken || refreshResult.data.refreshToken || refreshToken;

        // Store the new token
        api.dispatch(
          setCredentials({
            user: api.getState().auth.user, // Keep existing user
            token: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed (e.g. refresh token expired)
        api.dispatch(logout());
      }
    } else {
      // No refresh token available, log out
      api.dispatch(logout());
    }
  }

  return result;
};

// Create the RTK Query API
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            })
          );
        } catch (err) {
          console.error('Login Error:', err);
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
    updateAccount: builder.mutation({
      query: (data) => ({
        url: '/users/update-account',
        method: 'PUT',
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data }));
        } catch (err) {
          console.error('Update Account Error:', err);
        }
      },
    }),
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/update-avatar',
        method: 'PUT',
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data }));
        } catch (err) {
          console.error('Update Avatar Error:', err);
        }
      },
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: passwords,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutUserMutation,
  useUpdateAccountMutation,
  useUpdateAvatarMutation,
  useChangePasswordMutation
} = authApi;
