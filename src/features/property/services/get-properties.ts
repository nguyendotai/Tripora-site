import { serverFetch } from "@/shared/services/server-fetch";
import type { PaginatedProperties, PropertySort } from "../types/property.types";

export function getProperties(params?: {
  q?: string;
  destinationId?: string;
  sort?: PropertySort;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.destinationId) search.set("destinationId", params.destinationId);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedProperties>(`/properties${query ? `?${query}` : ""}`);
}
