import { baseApi } from "@/shared/services/base-api";
import type { PaginatedPayments, Payment } from "../types/payment.types";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayment: builder.query<Payment, string>({
      query: (id) => ({ url: `/payments/${id}` }),
      providesTags: (_result, _error, id) => [{ type: "Payment" as const, id }],
    }),
    listMyPayments: builder.query<PaginatedPayments, { page?: number; limit?: number } | void>({
      query: (params) => ({ url: "/payments/mine", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((payment) => ({ type: "Payment" as const, id: payment.id })),
              { type: "Payment" as const, id: "LIST" },
            ]
          : [{ type: "Payment" as const, id: "LIST" }],
    }),
    retryPayment: builder.mutation<{ checkoutUrl: string }, string>({
      query: (id) => ({ url: `/payments/${id}/retry`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Payment" as const, id }],
    }),
  }),
});

export const { useGetPaymentQuery, useListMyPaymentsQuery, useRetryPaymentMutation } = paymentApi;
