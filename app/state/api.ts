/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiltersState } from ".";
import { Cooler, User } from "../lib/schemas";
import { cleanParams, withToast } from "../lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // Use Next.js API routes
    prepareHeaders: async (headers) => {
      // NextAuth sessions are handled automatically by Next.js API routes
      // No need to manually add Authorization headers
      return headers;
    }
  }),
  reducerPath: "api",
  tagTypes: ["Notifications", "Messages", "Users", "Admins", "Coolers", "CoolerDetails"],
  endpoints: (build) => ({
    getAuthUser: build.query<{
      sessionInfo: any;
      userInfo: User;
      userRole: string;
    }, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          // Get the NextAuth session through our API route
          const sessionResponse = await fetch('/api/auth/session');
          if (!sessionResponse.ok) {
            throw new Error('No active session');
          }
          
          const session = await sessionResponse.json();
          if (!session || !session.user) {
            throw new Error('No authenticated user');
          }

          // Extract user role from session
          const userRole = session.user.roles?.[0] || 'user';
          const userId = session.user.id;

          // Fetch user details from backend
          const endpoint = userRole === "admin" ? `/admins/${userId}` : `/users/${userId}`;
          const userDetailsResponse = await fetchWithBQ(endpoint);

          if (userDetailsResponse.error) {
            // If user doesn't exist in backend, could create them here
            // For now, just return session data
            return {
              data: {
                sessionInfo: session,
                userInfo: {
                  _id: userId,
                  email: session.user.email,
                  name: session.user.name,
                  password: '', // Not needed for frontend
                  company: session.user.tenantId || '',
                  role: (session.user.roles?.[0] || 'user') as 'admin' | 'user',
                } as User,
                userRole,
              }
            };
          }

          return {
            data: {
              sessionInfo: session,
              userInfo: userDetailsResponse.data as User,
              userRole,
            }
          };
        }
        catch (error: any) {
          return {
            error: error.message || "Could not fetch user data",
          }
        }
      },
      providesTags: ["Users"],
    }),

    updateUserSettings: build.mutation<User, {cognitoId: string } & Partial<User>>({
      query: ({cognitoId, ...updatedUser}) => ({
        url: `/users/${cognitoId}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: (result) => [{ type: "Users", id: result?._id }],
      
    }),
    updateAdminSettings: build.mutation<User, {cognitoId: string } & Partial<User>>({
      query: ({cognitoId, ...updatedUser}) => ({
        url: `/admins/${cognitoId}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: (result) => [{ type: "Admins", id: result?._id }],

    }),

    // Notifications endpoints
    getNotifications: build.query<NotificationItem[], { limit?: number; offset?: number }>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: '/api/notifications',
        params: { limit, offset }
      }),
      transformResponse: (response: any) => {
        // Transform the response if needed
        return response.map((notification: any) => ({
          id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          priority: notification.priority,
          timestamp: notification.timestamp,
          coolerId: notification.cooler,
          metadata: notification.metadata
        }));
      },
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Notifications' as const, id })),
              { type: 'Notifications', id: 'LIST' }
            ]
          : [{ type: 'Notifications', id: 'LIST' }]
    }),

    markNotificationRead: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH'
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Notifications', id },
        { type: 'Notifications', id: 'LIST' }
      ]
    }),

    markAllNotificationsRead: build.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }]
    }),

    // Messages endpoints
    getMessages: build.query<Message[], { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: '/messages',
        params: { limit, offset }
      }),
      transformResponse: (response: any) => {
        // Transform the response if needed
        return response.map((message: any) => ({
          id: message.id,
          sender: {
            id: message.sender._id,
            name: message.sender.name,
            email: message.sender.email,
            role: message.sender.role
          },
          content: message.content,
          timestamp: message.timestamp,
          read: message.read,
          threadId: message.threadId
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Messages' as const, id })),
              { type: 'Messages', id: 'LIST' }
            ]
          : [{ type: 'Messages', id: 'LIST' }]
    }),

    getMessage: build.query<MessageThread, string>({
      query: (id) => `/messages/${id}`,
      transformResponse: (response: any) => ({
        id: response.id,
        threadId: response.threadId,
        sender: {
          id: response.sender._id,
          name: response.sender.name,
          email: response.sender.email,
          role: response.sender.role
        },
        thread: response.thread.map((msg: any) => ({
          content: msg.content,
          timestamp: msg.timestamp,
          isFromMe: msg.isFromMe
        }))
      }),
      providesTags: (_, __, id) => [{ type: 'Messages', id }]
    }),

    sendMessage: build.mutation<{ success: boolean }, { recipientId: string; content: string; threadId?: string }>({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Messages', id: 'LIST' }]
    }),

    markMessageRead: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/messages/${id}/read`,
        method: 'PATCH'
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Messages', id },
        { type: 'Messages', id: 'LIST' },
        { type: 'Notifications', id: 'LIST' } // Also invalidate notifications as they might contain message notifications
      ]
    }),

    getCoolers: build.query<Cooler[], Partial<FiltersState>>({
      query: (filters) => ({
        url: '/coolers',
        params: cleanParams(filters),
      }),
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: "Coolers" as const, id: _id })),
              { type: "Coolers", id: "LIST" }
            ]
          : [{ type: "Coolers", id: "LIST" }],
    }),
    
    getCooler: build.query<Cooler, string>({
      query: (id) => `/api/coolers/${id}`,
      providesTags: (result, error, id) => [{ type: "CoolerDetails", id }],
      async onQueryStarted(_, {queryFulfilled}) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch cooler details",
        });
      },
    }),

    getCoolerStatusCounts: build.query<{
      statusCounts: Record<string, number>;
      total: number;
    }, Partial<FiltersState>>({
      query: (filters) => ({
        url: '/coolers/status-counts',
        params: cleanParams(filters),
      }),
      providesTags: ["Coolers"],
    }),

    getUser: build.query<User, string>({
      query: (cognitoId) => `/api/users/${cognitoId}`,
      providesTags: (result) => [{ type: "Users", id: result?._id }],
      async onQueryStarted(_, {queryFulfilled}) {
        await withToast(queryFulfilled, {
          error: "Failed to load user profile",
        });
      },
    }),
    createCooler: build.mutation<Cooler, FormData>({
      query: (newCooler) => ({
        url: '/api/coolers',
        method: 'POST',
        body: newCooler,
      }),
      invalidatesTags: (result) => [
        { type: 'Coolers', id: 'LIST' },
        { type: 'Coolers', id: result?._id }
      ],
      async onQueryStarted(_, {queryFulfilled}) {
        await withToast(queryFulfilled, {
          success: "Cooler created successfully",
          error: "Failed to create cooler",
        });
      },
    }),
  }),
});

// Export the hook
export const {
  useGetAuthUserQuery,
  useUpdateUserSettingsMutation,
  useUpdateAdminSettingsMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetMessagesQuery,
  useGetMessageQuery,
  useSendMessageMutation,
  useMarkMessageReadMutation,
  useGetCoolersQuery,
  useGetCoolerStatusCountsQuery,
  useGetCoolerQuery
} = api;
