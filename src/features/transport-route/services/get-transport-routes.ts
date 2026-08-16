import { serverFetch } from "@/shared/services/server-fetch";
import type { PaginatedTransportRoutes, TransportRoute } from "../types/transport-route.types";

export function getTransportRoutes(params?: { origin?: string; destination?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params?.origin) search.set("origin", params.origin);
  if (params?.destination) search.set("destination", params.destination);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedTransportRoutes>(`/transport-routes${query ? `?${query}` : ""}`);
}

export function getTransportRouteById(id: string) {
  return serverFetch<TransportRoute>(`/transport-routes/${id}`);
}
