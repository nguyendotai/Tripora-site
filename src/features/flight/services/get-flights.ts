import { serverFetch } from "@/shared/services/server-fetch";
import type { Flight, PaginatedFlights } from "../types/flight.types";

export function getFlights(params?: {
  departureAirportId?: string;
  arrivalAirportId?: string;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params?.departureAirportId) search.set("departureAirportId", params.departureAirportId);
  if (params?.arrivalAirportId) search.set("arrivalAirportId", params.arrivalAirportId);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedFlights>(`/flights${query ? `?${query}` : ""}`);
}

export function getFlightById(id: string) {
  return serverFetch<Flight>(`/flights/${id}`);
}
