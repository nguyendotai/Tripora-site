import { baseApi } from "@/shared/services/base-api";
import type { AuthUser } from "@/features/auth/types/auth.types";

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthUser, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateMe: builder.mutation<AuthUser, UpdateProfileInput>({
      query: (body) => ({ url: "/users/me", method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetMeQuery, useUpdateMeMutation } = userApi;
