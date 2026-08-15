import { baseApi } from "@/shared/services/base-api";
import type { ExperienceAvailabilityResult, ExperienceBooking } from "../types/experience-booking.types";

export interface CreateExperienceBookingInput {
  experienceId: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

export type ExperienceBookingStatusFilter = "upcoming" | "completed" | "cancelled";

export const experienceBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkExperienceAvailability: builder.query<
      ExperienceAvailabilityResult,
      { experienceId: string; departureDate: string }
    >({
      query: (params) => ({ url: "/experience-bookings/availability", params }),
    }),
    createExperienceBooking: builder.mutation<ExperienceBooking, CreateExperienceBookingInput>({
      query: (body) => ({ url: "/experience-bookings", method: "POST", body }),
      invalidatesTags: [{ type: "ExperienceBooking", id: "LIST" }],
    }),
    listMyExperienceBookings: builder.query<ExperienceBooking[], ExperienceBookingStatusFilter | void>({
      query: (status) => ({
        url: "/experience-bookings/mine",
        params: status ? { status } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((booking) => ({ type: "ExperienceBooking" as const, id: booking.id })),
              { type: "ExperienceBooking" as const, id: "LIST" },
            ]
          : [{ type: "ExperienceBooking" as const, id: "LIST" }],
    }),
    cancelExperienceBooking: builder.mutation<ExperienceBooking, string>({
      query: (id) => ({ url: `/experience-bookings/${id}/cancel`, method: "PATCH" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ExperienceBooking", id },
        { type: "ExperienceBooking", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useLazyCheckExperienceAvailabilityQuery,
  useCreateExperienceBookingMutation,
  useListMyExperienceBookingsQuery,
  useCancelExperienceBookingMutation,
} = experienceBookingApi;
