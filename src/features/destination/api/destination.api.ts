import { baseApi } from "@/shared/services/base-api";
import type { PaginatedDestinations } from "../types/destination.types";

/** RTK Query rieng cho Client Component can tuong tac (VD: picker chon Destination trong form
 * tao Post) — trang danh sach/detail cong khai van dung server-fetch.ts (SSR) nhu cu, khong doi. */
export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDestinations: builder.query<PaginatedDestinations, { limit?: number } | void>({
      query: (params) => ({ url: "/destinations", params: params ?? undefined }),
    }),
  }),
});

export const { useListDestinationsQuery } = destinationApi;
