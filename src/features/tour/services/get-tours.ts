import { serverFetch } from "@/shared/services/server-fetch";
import type { PaginatedTours, Tour, TourSort } from "../types/tour.types";

export function getTours(params?: {
  q?: string;
  destinationId?: string;
  sort?: TourSort;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.destinationId) search.set("destinationId", params.destinationId);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedTours>(`/tours${query ? `?${query}` : ""}`);
}

export function getTourBySlug(slug: string) {
  return serverFetch<Tour>(`/tours/${slug}`);
}

export function getPopularTours(limit = 6) {
  return serverFetch<Tour[]>(`/tours/popular?limit=${limit}`);
}
