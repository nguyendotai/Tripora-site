import { serverFetch } from "@/shared/services/server-fetch";
import type { PaginatedPosts } from "../types/post.types";

export function getPosts(params?: { limit?: number }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  const query = search.toString();

  return serverFetch<PaginatedPosts>(`/posts${query ? `?${query}` : ""}`);
}
