import { baseApi } from "@/shared/services/base-api";
import type { SavedPost } from "../types/saved-post.types";

export const savedPostApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMySavedPosts: builder.query<SavedPost[], void>({
      query: () => "/saved-posts/mine",
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: "SavedPost" as const, id: item.postId })),
              { type: "SavedPost" as const, id: "LIST" },
            ]
          : [{ type: "SavedPost" as const, id: "LIST" }],
    }),

    savePost: builder.mutation<SavedPost, { postId: string }>({
      query: (body) => ({ url: "/saved-posts", method: "POST", body }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "SavedPost", id: postId },
        { type: "SavedPost", id: "LIST" },
      ],
    }),

    unsavePost: builder.mutation<void, { postId: string }>({
      query: ({ postId }) => ({ url: `/saved-posts/${postId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "SavedPost", id: postId },
        { type: "SavedPost", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListMySavedPostsQuery,
  useSavePostMutation,
  useUnsavePostMutation,
} = savedPostApi;
