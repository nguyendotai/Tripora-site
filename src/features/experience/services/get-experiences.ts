import { serverFetch } from "@/shared/services/server-fetch";
import type { Experience, ExperienceSort, PaginatedExperiences } from "../types/experience.types";

export function getExperiences(params?: {
  q?: string;
  destinationId?: string;
  sort?: ExperienceSort;
  page?: number;
}) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.destinationId) search.set("destinationId", params.destinationId);
  if (params?.sort) search.set("sort", params.sort);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedExperiences>(`/experiences${query ? `?${query}` : ""}`);
}

export function getExperienceBySlug(slug: string) {
  return serverFetch<Experience>(`/experiences/${slug}`);
}

export function getPopularExperiences(limit = 6) {
  return serverFetch<Experience[]>(`/experiences/popular?limit=${limit}`);
}
