import { serverFetch } from "@/shared/services/server-fetch";
import type { FlightSchedule } from "../types/flight-schedule.types";

/** Public, khong phan trang (mirror get-tour-schedule). GET /flight-schedules bat buoc ca
 * 3 tham so flightId+startDate+endDate — khong co "list tat ca lich cua 1 Flight" khong gioi han. */
export async function getFlightSchedules(
  flightId: string,
  startDate: string,
  endDate: string,
): Promise<FlightSchedule[]> {
  const result = await serverFetch<FlightSchedule[]>(
    `/flight-schedules?flightId=${flightId}&startDate=${startDate}&endDate=${endDate}`,
  );
  return result ?? [];
}
