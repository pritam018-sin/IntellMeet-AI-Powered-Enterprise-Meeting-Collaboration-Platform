import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './authApi';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Workspace', 'Project', 'Task'],
  endpoints: (builder) => ({
    // Workspaces
    createWorkspace: builder.mutation({
      query: (body) => ({
        url: '/workspaces',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Workspace'],
    }),
    getMyWorkspaces: builder.query({
      query: () => '/workspaces',
      providesTags: ['Workspace'],
    }),
    getWorkspaceById: builder.query({
      query: (id) => `/workspaces/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workspace', id }],
    }),
    
    // Projects
    createProject: builder.mutation({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Project'],
    }),
    getProjectsByWorkspace: builder.query({
      query: (workspaceId) => `/projects/workspace/${workspaceId}`,
      providesTags: ['Project'],
    }),
    
    // Tasks
    createTask: builder.mutation({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    getTasksByProject: builder.query({
      query: (projectId) => `/tasks/project/${projectId}`,
      providesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useCreateWorkspaceMutation,
  useGetMyWorkspacesQuery,
  useGetWorkspaceByIdQuery,
  useCreateProjectMutation,
  useGetProjectsByWorkspaceQuery,
  useCreateTaskMutation,
  useGetTasksByProjectQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = projectApi;
