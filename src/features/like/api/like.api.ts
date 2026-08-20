import { baseApi } from "@/shared/services/base-api";
import type { Like } from "../types/like.types";

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyLikes: builder.query<Like[], void>({
      query: () => "/likes/mine",
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: "Like" as const, id: item.postId })),
              { type: "Like" as const, id: "LIST" },
            ]
          : [{ type: "Like" as const, id: "LIST" }],
    }),

    likePost: builder.mutation<Like, { postId: string }>({
      query: (body) => ({ url: "/likes", method: "POST", body }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Like", id: postId },
        { type: "Like", id: "LIST" },
        { type: "Post", id: postId },
      ],
    }),

    unlikePost: builder.mutation<void, { postId: string }>({
      query: ({ postId }) => ({ url: `/likes/${postId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Like", id: postId },
        { type: "Like", id: "LIST" },
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const { useListMyLikesQuery, useLikePostMutation, useUnlikePostMutation } = likeApi;
