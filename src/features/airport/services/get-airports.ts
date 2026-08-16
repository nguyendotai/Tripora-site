import { serverFetch } from "@/shared/services/server-fetch";
import type { Airport, PaginatedAirports } from "../types/airport.types";

/** Danh sách day du (limit 100, du du liệu mock) dung de render 2 dropdown chon san bay
 * o form tim kiem Flight — khong co field text tu do nhu TransportRoute.origin/destination
 * vi Flight dung FK departureAirportId/arrivalAirportId, khong phai chuoi tu do. */
export async function getAirports(): Promise<Airport[]> {
  const result = await serverFetch<PaginatedAirports>("/airports?limit=100");
  return result?.items ?? [];
}
