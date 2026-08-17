import { baseApi } from "@/shared/services/base-api";
import type { Provider, ProviderType } from "../types/provider.types";

export interface ApplyProviderInput {
  name: string;
  type: ProviderType;
  description?: string;
  logo?: string;
  contact?: string;
}

export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProvider: builder.query<Provider, void>({
      query: () => "/providers/me",
      providesTags: ["Provider"],
    }),
    applyProvider: builder.mutation<Provider, ApplyProviderInput>({
      query: (body) => ({ url: "/providers/apply", method: "POST", body }),
      invalidatesTags: ["Provider"],
    }),
  }),
});

export const { useGetMyProviderQuery, useApplyProviderMutation } = providerApi;
