import { baseApi } from "@/shared/services/base-api";
import type { Comment, PaginatedComments } from "../types/comment.types";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listComments: builder.query<PaginatedComments, { postId: string }>({
      query: ({ postId }) => ({ url: "/comments", params: { postId, limit: 50 } }),
      providesTags: (result, _error, { postId }) =>
        result
          ? [
              ...result.items.map((c) => ({ type: "Comment" as const, id: c.id })),
              { type: "Comment" as const, id: `LIST-${postId}` },
            ]
          : [{ type: "Comment" as const, id: `LIST-${postId}` }],
    }),

    createComment: builder.mutation<Comment, { postId: string; content: string }>({
      query: (body) => ({ url: "/comments", method: "POST", body }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comment", id: `LIST-${postId}` },
        { type: "Post", id: postId },
      ],
    }),

    updateComment: builder.mutation<Comment, { id: string; postId: string; content: string }>({
      query: ({ id, content }) => ({ url: `/comments/${id}`, method: "PATCH", body: { content } }),
      invalidatesTags: (_result, _error, { postId }) => [{ type: "Comment", id: `LIST-${postId}` }],
    }),

    deleteComment: builder.mutation<void, { id: string; postId: string }>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Comment", id: `LIST-${postId}` },
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const {
  useListCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
