export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  description: string | null;
  images: string[] | null;
  tags: string[] | null;
  bestTime: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}
