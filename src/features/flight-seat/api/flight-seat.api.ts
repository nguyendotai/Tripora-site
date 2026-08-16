import { baseApi } from "@/shared/services/base-api";
import type { FlightSeat } from "../types/flight-seat.types";

export const flightSeatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listFlightSeats: builder.query<FlightSeat[], string>({
      query: (scheduleId) => ({ url: "/flight-seats", params: { scheduleId } }),
      providesTags: (result, _error, scheduleId) =>
        result
          ? [
              ...result.map((seat) => ({ type: "FlightSeat" as const, id: seat.id })),
              { type: "FlightSeat" as const, id: `LIST-${scheduleId}` },
            ]
          : [{ type: "FlightSeat" as const, id: `LIST-${scheduleId}` }],
    }),
  }),
});

export const { useListFlightSeatsQuery } = flightSeatApi;
