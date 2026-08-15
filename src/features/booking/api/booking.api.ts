import { baseApi } from "@/shared/services/base-api";
import type { AvailabilityResult, Booking, GuestInput } from "../types/booking.types";

export interface CreateBookingInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: GuestInput[];
}

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
  }),
});

export const { useLazyCheckAvailabilityQuery, useCreateBookingMutation } = bookingApi;
