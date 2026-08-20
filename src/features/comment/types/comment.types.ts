import type { PaginationMeta } from "@/features/post/types/post.types";

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
}

export interface PaginatedComments {
  items: Comment[];
  pagination: PaginationMeta;
}
