import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const aiApi = createApi({
    reducerPath: 'aiApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        generateSummary: builder.mutation({
            query: ({ meetingCode, transcript }) => ({
                url: `/ai/${meetingCode}/summary`,
                method: 'POST',
                body: { transcript },
            }),
        }),
    }),
});

export const { useGenerateSummaryMutation } = aiApi;
