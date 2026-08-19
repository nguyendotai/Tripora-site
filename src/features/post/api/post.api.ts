import { baseApi } from "@/shared/services/base-api";
import type { PaginatedPosts, Post } from "../types/post.types";

export interface PostListParams {
  page?: number;
  limit?: number;
  destinationId?: string;
}

export interface PostInput {
  caption: string;
  images: string[];
  destinationId?: string;
}

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPosts: builder.query<PaginatedPosts, PostListParams | void>({
      query: (params) => ({ url: "/posts", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Post" as const, id: p.id })),
              { type: "Post" as const, id: "LIST" },
            ]
          : [{ type: "Post" as const, id: "LIST" }],
    }),
    listMyPosts: builder.query<PaginatedPosts, PostListParams | void>({
      query: (params) => ({ url: "/posts/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: "Post" as const, id: p.id })),
              { type: "Post" as const, id: "MY-LIST" },
            ]
          : [{ type: "Post" as const, id: "MY-LIST" }],
    }),
    createPost: builder.mutation<Post, PostInput>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
      invalidatesTags: [
        { type: "Post", id: "LIST" },
        { type: "Post", id: "MY-LIST" },
      ],
    }),
    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Post", id: "LIST" },
        { type: "Post", id: "MY-LIST" },
      ],
    }),
  }),
});

export const {
  useListPostsQuery,
  useListMyPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} = postApi;
