import { baseApi } from "@/shared/services/base-api";

export interface TrackEventInput {
  type: "SEARCH" | "VIEW";
  userId?: string;
  entityType?: string;
  entityId?: string;
  query?: string;
}

export const analyticsEventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackEvent: builder.mutation<void, TrackEventInput>({
      query: (body) => ({ url: "/analytics-events", method: "POST", body }),
    }),
  }),
});

export const { useTrackEventMutation } = analyticsEventApi;
