import { serverFetch } from "@/shared/services/server-fetch";
import type { Promotion } from "../types/promotion.types";

export function getActivePromotions(limit = 6) {
  return serverFetch<Promotion[]>(`/promotions/active?limit=${limit}`);
}
