export interface PostAuthor {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  _count?: { followers: number };
}

export interface PostDestination {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  userId: string;
  destinationId?: string | null;
  caption: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: PostAuthor;
  destination?: PostDestination | null;
  _count?: { likes: number };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedPosts {
  items: Post[];
  pagination: PaginationMeta;
}
