import type { PaginationMeta } from "@/features/destination/types/destination.types";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBlogPosts {
  items: BlogPost[];
  pagination: PaginationMeta;
}
