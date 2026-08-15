import { baseApi } from "@/shared/services/base-api";
import type { TourAvailabilityResult, TourBooking } from "../types/tour-booking.types";

export interface CreateTourBookingInput {
  tourId: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export type TourBookingStatusFilter = "upcoming" | "completed" | "cancelled";

export const tourBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkTourAvailability: builder.query<
      TourAvailabilityResult,
      { tourId: string; departureDate: string }
    >({
      query: (params) => ({ url: "/tour-bookings/availability", params }),
    }),
    createTourBooking: builder.mutation<TourBooking, CreateTourBookingInput>({
      query: (body) => ({ url: "/tour-bookings", method: "POST", body }),
      invalidatesTags: [{ type: "TourBooking", id: "LIST" }],
    }),
    listMyTourBookings: builder.query<TourBooking[], TourBookingStatusFilter | void>({
      query: (status) => ({
        url: "/tour-bookings/mine",
        params: status ? { status } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((booking) => ({ type: "TourBooking" as const, id: booking.id })),
              { type: "TourBooking" as const, id: "LIST" },
            ]
          : [{ type: "TourBooking" as const, id: "LIST" }],
    }),
    cancelTourBooking: builder.mutation<TourBooking, string>({
      query: (id) => ({ url: `/tour-bookings/${id}/cancel`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "TourBooking", id },
        { type: "TourBooking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useLazyCheckTourAvailabilityQuery,
  useCreateTourBookingMutation,
  useListMyTourBookingsQuery,
  useCancelTourBookingMutation,
} = tourBookingApi;
