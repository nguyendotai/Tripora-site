import { serverFetch } from "@/shared/services/server-fetch";
import type { Destination, PaginatedDestinations } from "../types/destination.types";

export function getDestinations(params?: { q?: string; page?: number; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const query = search.toString();

  return serverFetch<PaginatedDestinations>(
    `/destinations${query ? `?${query}` : ""}`,
  );
}

export function getDestinationBySlug(slug: string) {
  return serverFetch<Destination>(`/destinations/${slug}`);
}
