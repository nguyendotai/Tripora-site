import { baseApi } from "@/shared/services/base-api";
import type { Payment } from "../types/payment.types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayment: builder.query<Payment, string>({
      query: (id) => ({ url: `/payments/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Payment" as const, id }],
    }),
    retryPayment: builder.mutation<{ checkoutUrl: string }, string>({
      query: (id) => ({ url: `/payments/${id}/retry`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Payment" as const, id }],
    }),
  }),
});

export const { useGetPaymentQuery, useRetryPaymentMutation } = paymentApi;
