import { baseApi } from '@/shared/services/base-api';
import type { RoomAvailability } from '../types/property.types';

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomAvailability: builder.query<RoomAvailability[], { roomId: string; from: string; to: string }>({
      query: ({ roomId, from, to }) => ({
        url: `/rooms/${roomId}/availability`,
        params: { from, to },
      }),
    }),
  }),
});

export const { useGetRoomAvailabilityQuery, useLazyGetRoomAvailabilityQuery } = propertyApi;
