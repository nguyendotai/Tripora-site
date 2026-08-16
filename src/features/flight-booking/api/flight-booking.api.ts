import { baseApi } from "@/shared/services/base-api";
import type { FlightBooking } from "../types/flight-booking.types";

export interface CreateFlightBookingInput {
  scheduleId: string;
  seatIds: string[];
  passengers: { fullName: string; idNumber: string }[];
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export const flightBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFlightBooking: builder.mutation<FlightBooking, CreateFlightBookingInput>({
      query: (body) => ({ url: "/flight-bookings", method: "POST", body }),
      invalidatesTags: (result) =>
        result ? [{ type: "FlightSeat", id: `LIST-${result.scheduleId}` }] : [],
    }),
  }),
});

export const { useCreateFlightBookingMutation } = flightBookingApi;
