import { baseApi } from "@/shared/services/base-api";
import type { PaginatedTrips, Trip, TripDay, TripDetail, TripItem } from "../types/trip.types";

export interface CreateTripInput {
  title: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTripItemInput {
  title: string;
  note?: string;
  destinationId?: string;
}

export const tripApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTrips: builder.query<PaginatedTrips, { page?: number } | void>({
      query: (params) => ({ url: "/trips", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((t) => ({ type: "Trip" as const, id: t.id })),
              { type: "Trip" as const, id: "LIST" },
            ]
          : [{ type: "Trip" as const, id: "LIST" }],
    }),

    getTrip: builder.query<TripDetail, string>({
      query: (id) => `/trips/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Trip", id }],
    }),

    createTrip: builder.mutation<Trip, CreateTripInput>({
      query: (body) => ({ url: "/trips", method: "POST", body }),
      invalidatesTags: [{ type: "Trip", id: "LIST" }],
    }),

    deleteTrip: builder.mutation<void, string>({
      query: (id) => ({ url: `/trips/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Trip", id: "LIST" }],
    }),

    addTripDay: builder.mutation<TripDay, { tripId: string }>({
      query: ({ tripId }) => ({ url: `/trips/${tripId}/days`, method: "POST", body: {} }),
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Trip", id: tripId }],
    }),

    deleteTripDay: builder.mutation<void, { tripId: string; dayId: string }>({
      query: ({ tripId, dayId }) => ({
        url: `/trips/${tripId}/days/${dayId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Trip", id: tripId }],
    }),

    addTripItem: builder.mutation<
      TripItem,
      { tripId: string; dayId: string; data: CreateTripItemInput }
    >({
      query: ({ tripId, dayId, data }) => ({
        url: `/trips/${tripId}/days/${dayId}/items`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Trip", id: tripId }],
    }),

    deleteTripItem: builder.mutation<
      void,
      { tripId: string; dayId: string; itemId: string }
    >({
      query: ({ tripId, dayId, itemId }) => ({
        url: `/trips/${tripId}/days/${dayId}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Trip", id: tripId }],
    }),

    reorderTripItems: builder.mutation<
      void,
      { tripId: string; dayId: string; itemIds: string[] }
    >({
      query: ({ tripId, dayId, itemIds }) => ({
        url: `/trips/${tripId}/days/${dayId}/items/reorder`,
        method: "PATCH",
        body: { itemIds },
      }),
      invalidatesTags: (_result, _error, { tripId }) => [{ type: "Trip", id: tripId }],
    }),
  }),
});

export const {
  useListTripsQuery,
  useGetTripQuery,
  useCreateTripMutation,
  useDeleteTripMutation,
  useAddTripDayMutation,
  useDeleteTripDayMutation,
  useAddTripItemMutation,
  useDeleteTripItemMutation,
  useReorderTripItemsMutation,
} = tripApi;
