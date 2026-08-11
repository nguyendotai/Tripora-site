import { serverFetch } from "@/shared/services/server-fetch";
import type { PaginatedTravelGuides, TravelGuide } from "../types/travel-guide.types";

export function getTravelGuides(params?: { q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedTravelGuides>(
    `/travel-guides${query ? `?${query}` : ""}`,
  );
}

export function getTravelGuideBySlug(slug: string) {
  return serverFetch<TravelGuide>(`/travel-guides/${slug}`);
}
