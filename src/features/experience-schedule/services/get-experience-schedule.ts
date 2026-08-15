import { serverFetch } from "@/shared/services/server-fetch";
import type { ExperienceSchedule } from "../types/experience-schedule.types";

export function getExperienceSchedule(experienceId: string, startDate: string, endDate: string) {
  return serverFetch<ExperienceSchedule[]>(
    `/experience-schedules?experienceId=${experienceId}&startDate=${startDate}&endDate=${endDate}`,
  );
}
