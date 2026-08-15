import { baseApi } from "@/shared/services/base-api";
import type { AvailabilityResult, Booking, GuestInput } from "../types/booking.types";

export interface CreateBookingInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: GuestInput[];
}

export type BookingStatusFilter = "upcoming" | "completed" | "cancelled";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkAvailability: builder.query<
      AvailabilityResult,
      { roomId: string; checkInDate: string; checkOutDate: string }
    >({
      query: (params) => ({ url: "/bookings/availability", params }),
    }),
    createBooking: builder.mutation<Booking, CreateBookingInput>({
      query: (body) => ({ url: "/bookings", method: "POST", body }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
    listMyBookings: builder.query<Booking[], BookingStatusFilter | void>({
      query: (status) => ({ url: "/bookings/mine", params: status ? { status } : undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((booking) => ({ type: "Booking" as const, id: booking.id })),
              { type: "Booking" as const, id: "LIST" },
            ]
          : [{ type: "Booking" as const, id: "LIST" }],
    }),
    cancelBooking: builder.mutation<Booking, string>({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Booking", id },
        { type: "Booking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useLazyCheckAvailabilityQuery,
  useCreateBookingMutation,
  useListMyBookingsQuery,
  useCancelBookingMutation,
} = bookingApi;
