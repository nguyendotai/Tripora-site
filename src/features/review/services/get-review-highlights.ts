import { serverFetch } from "@/shared/services/server-fetch";
import type { ReviewHighlight } from "../types/review.types";

export function getReviewHighlights(limit = 6) {
  return serverFetch<ReviewHighlight[]>(`/reviews/highlights?limit=${limit}`);
}
