export interface Property {
  id: string;
  providerId: string;
  destinationId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[] | null;
  amenities?: string[] | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  policies?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  destination?: { id: string; name: string; slug: string } | null;
  fromPrice?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedProperties {
  items: Property[];
  pagination: PaginationMeta;
}

export type PropertySort = "newest" | "name_asc";
