import { baseApi } from "@/shared/services/base-api";
import type { WishlistItem } from "../types/wishlist.types";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWishlist: builder.query<WishlistItem[], void>({
      query: () => "/wishlist",
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: "Wishlist" as const, id: item.destinationId })),
              { type: "Wishlist" as const, id: "LIST" },
            ]
          : [{ type: "Wishlist" as const, id: "LIST" }],
    }),

    addToWishlist: builder.mutation<WishlistItem, { destinationId: string }>({
      query: (body) => ({ url: "/wishlist", method: "POST", body }),
      invalidatesTags: (_result, _error, { destinationId }) => [
        { type: "Wishlist", id: destinationId },
        { type: "Wishlist", id: "LIST" },
      ],
    }),

    removeFromWishlist: builder.mutation<void, { destinationId: string }>({
      query: ({ destinationId }) => ({ url: `/wishlist/${destinationId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { destinationId }) => [
        { type: "Wishlist", id: destinationId },
        { type: "Wishlist", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
