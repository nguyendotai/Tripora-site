import { baseApi } from "@/shared/services/base-api";
import type { PaginatedReviews, Review } from "../types/review.types";

// V7 vòng 9 — Review giờ gắn được với Destination hoặc Property (đúng 1 trong 2). Dùng union type
// để mọi lời gọi API luôn rõ ràng đang review đối tượng nào, tránh nhầm lẫn ID giữa các domain.
// V7 vòng 12 — thêm Tour/Experience/Flight, cùng nguyên tắc (đúng 1 trong 5).
export type ReviewTarget =
  | { destinationId: string; propertyId?: undefined; tourId?: undefined; experienceId?: undefined; flightId?: undefined }
  | { propertyId: string; destinationId?: undefined; tourId?: undefined; experienceId?: undefined; flightId?: undefined }
  | { tourId: string; destinationId?: undefined; propertyId?: undefined; experienceId?: undefined; flightId?: undefined }
  | { experienceId: string; destinationId?: undefined; propertyId?: undefined; tourId?: undefined; flightId?: undefined }
  | { flightId: string; destinationId?: undefined; propertyId?: undefined; tourId?: undefined; experienceId?: undefined };

function targetTag(target: ReviewTarget): string {
  if (target.destinationId) return `LIST-destination-${target.destinationId}`;
  if (target.propertyId) return `LIST-property-${target.propertyId}`;
  if (target.tourId) return `LIST-tour-${target.tourId}`;
  if (target.experienceId) return `LIST-experience-${target.experienceId}`;
  return `LIST-flight-${target.flightId}`;
}

export interface CreateReviewInput {
  rating: number;
  content?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  content?: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listReviews: builder.query<PaginatedReviews, ReviewTarget>({
      query: (target) => ({ url: "/reviews", params: { ...target } }),
      providesTags: (result, _error, target) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "Review" as const, id: r.id })),
              { type: "Review" as const, id: targetTag(target) },
            ]
          : [{ type: "Review" as const, id: targetTag(target) }],
    }),

    createReview: builder.mutation<Review, ReviewTarget & CreateReviewInput>({
      query: (body) => ({ url: "/reviews", method: "POST", body }),
      invalidatesTags: (_result, _error, target) => [
        { type: "Review", id: targetTag(target) },
      ],
    }),

    updateReview: builder.mutation<
      Review,
      { id: string; target: ReviewTarget; data: UpdateReviewInput }
    >({
      query: ({ id, data }) => ({ url: `/reviews/${id}`, method: "PATCH", body: data }),
      invalidatesTags: (_result, _error, { target }) => [
        { type: "Review", id: targetTag(target) },
      ],
    }),

    deleteReview: builder.mutation<void, { id: string; target: ReviewTarget }>({
      query: ({ id }) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { target }) => [
        { type: "Review", id: targetTag(target) },
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
