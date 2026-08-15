import { serverFetch } from "@/shared/services/server-fetch";
import type { TourSchedule } from "../types/tour-schedule.types";

export function getTourSchedule(tourId: string, startDate: string, endDate: string) {
  return serverFetch<TourSchedule[]>(
    `/tour-schedules?tourId=${tourId}&startDate=${startDate}&endDate=${endDate}`,
  );
}
