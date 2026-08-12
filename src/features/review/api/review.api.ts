import { baseApi } from "@/shared/services/base-api";
import type { PaginatedReviews, Review } from "../types/review.types";

export interface CreateReviewInput {
  destinationId: string;
  rating: number;
  content?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  content?: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReviews: builder.query<PaginatedReviews, { destinationId: string }>({
      query: ({ destinationId }) => ({ url: "/reviews", params: { destinationId } }),
      providesTags: (result, _error, { destinationId }) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "Review" as const, id: r.id })),
              { type: "Review" as const, id: `LIST-${destinationId}` },
            ]
          : [{ type: "Review" as const, id: `LIST-${destinationId}` }],
    }),

    createReview: builder.mutation<Review, CreateReviewInput>({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: (_result, _error, { destinationId }) => [
        { type: "Review", id: `LIST-${destinationId}` },
      ],
    }),

    updateReview: builder.mutation<
      Review,
      { id: string; destinationId: string; data: UpdateReviewInput }
    >({
      query: ({ id, data }) => ({ url: `/reviews/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { destinationId }) => [
        { type: "Review", id: `LIST-${destinationId}` },
      ],
    }),

    deleteReview: builder.mutation<void, { id: string; destinationId: string }>({
      query: ({ id }) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { destinationId }) => [
        { type: "Review", id: `LIST-${destinationId}` },
      ],
    }),
  }),
});

export const {
  useListReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
