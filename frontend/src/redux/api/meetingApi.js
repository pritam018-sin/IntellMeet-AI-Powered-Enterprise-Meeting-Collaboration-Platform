import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const meetingApi = createApi({
  reducerPath: 'meetingApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Meeting'],
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (title) => ({
        url: '/meetings/create',
        method: 'POST',
        body: { title },
      }),
      invalidatesTags: ['Meeting'],
    }),
    joinMeeting: builder.mutation({
      query: (meetingCode) => ({
        url: '/meetings/join',
        method: 'POST',
        body: { meetingCode },
      }),
      invalidatesTags: ['Meeting'],
    }),
    getMyMeetings: builder.query({
      query: () => ({
        url: '/meetings/my-meetings',
        method: 'GET',
      }),
      providesTags: ['Meeting'],
    }),
    leaveMeeting: builder.mutation({
      query: (meetingCode) => ({
        url: '/meetings/leave',
        method: 'POST',
        body: { meetingCode },
      }),
      invalidatesTags: ['Meeting'],
    }),
    endMeeting: builder.mutation({
      query: ({ meetingCode, sharedNotes }) => ({
        url: `/meetings/end/${meetingCode}`,
        method: 'PATCH',
        body: { sharedNotes },
      }),
      invalidatesTags: ['Meeting'],
    }),
    getMeetingById: builder.query({
      query: (meetingId) => ({
        url: `/meetings/${meetingId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Meeting', id }],
    }),
    deleteMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `/meetings/${meetingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Meeting'],
    }),
    uploadRecording: builder.mutation({
      query: ({ meetingCode, formData }) => ({
        url: `/meetings/upload-recording/${meetingCode}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Meeting'],
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useJoinMeetingMutation,
  useGetMyMeetingsQuery,
  useLeaveMeetingMutation,
  useEndMeetingMutation,
  useGetMeetingByIdQuery,
  useDeleteMeetingMutation,
  useUploadRecordingMutation,
} = meetingApi;
