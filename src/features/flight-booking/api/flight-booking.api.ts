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

/** V6: Booking tao ra o PENDING_PAYMENT, phai redirect sang checkoutUrl (Stripe Checkout)
 * de hoan tat thanh toan thay vi hien confirmation ngay. */
export interface CreateFlightBookingResponse {
  booking: FlightBooking;
  checkoutUrl: string;
}

export const flightBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFlightBooking: builder.mutation<CreateFlightBookingResponse, CreateFlightBookingInput>({
      query: (body) => ({ url: "/flight-bookings", method: "POST", body }),
      invalidatesTags: (result) =>
        result ? [{ type: "FlightSeat", id: `LIST-${result.booking.scheduleId}` }] : [],
    }),
  }),
});

export const { useCreateFlightBookingMutation } = flightBookingApi;
