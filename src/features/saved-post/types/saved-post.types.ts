import type { Post } from "@/features/post/types/post.types";

export interface SavedPost {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  post: Post;
}
