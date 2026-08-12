import { serverFetch } from "@/shared/services/server-fetch";
import type { BlogPost, PaginatedBlogPosts } from "../types/blog.types";

export function getBlogPosts(params?: { q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  const query = search.toString();

  return serverFetch<PaginatedBlogPosts>(
    `/blog-posts${query ? `?${query}` : ""}`,
  );
}

export function getBlogPostBySlug(slug: string) {
  return serverFetch<BlogPost>(`/blog-posts/${slug}`);
}
