import { baseApi } from '@/shared/services/base-api';
import type { Booking, CreateBookingInput } from '../types/booking.types';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation<Booking, CreateBookingInput>({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => ({ url: `/bookings/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }],
    }),
    getMyBookings: builder.query<{ items: Booking[] }, void>({
      query: () => ({ url: '/bookings/mine' }),
      providesTags: [{ type: 'Booking', id: 'LIST' }],
    }),
    cancelBooking: builder.mutation<Booking, string>({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingQuery,
  useGetMyBookingsQuery,
  useCancelBookingMutation,
} = bookingApi;
