import { baseApi } from "@/shared/services/base-api";
import type { Follow } from "../types/follow.types";

export const followApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyFollowing: builder.query<Follow[], void>({
      query: () => "/follows/mine",
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: "Follow" as const, id: item.followingId })),
              { type: "Follow" as const, id: "LIST" },
            ]
          : [{ type: "Follow" as const, id: "LIST" }],
    }),

    listMyFollowers: builder.query<Follow[], void>({
      query: () => "/follows/followers",
    }),

    followUser: builder.mutation<Follow, { followingId: string }>({
      query: (body) => ({ url: "/follows", method: "POST", body }),
      invalidatesTags: (_result, _error, { followingId }) => [
        { type: "Follow", id: followingId },
        { type: "Follow", id: "LIST" },
        { type: "Post", id: "LIST" },
      ],
    }),

    unfollowUser: builder.mutation<void, { followingId: string }>({
      query: ({ followingId }) => ({ url: `/follows/${followingId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { followingId }) => [
        { type: "Follow", id: followingId },
        { type: "Follow", id: "LIST" },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListMyFollowingQuery,
  useListMyFollowersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = followApi;
