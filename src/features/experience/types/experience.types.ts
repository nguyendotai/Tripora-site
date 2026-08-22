export interface Experience {
  id: string;
  providerId: string;
  destinationId?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  images?: string[] | null;
  durationLabel?: string | null;
  price: string;
  currency: string;
  maxParticipants?: number | null;
  included?: string | null;
  excluded?: string | null;
  cancellationPolicy?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  destination?: { id: string; name: string; slug: string } | null;
  provider?: { id: string; name: string; userId: string } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedExperiences {
  items: Experience[];
  pagination: PaginationMeta;
}

export type ExperienceSort = "newest" | "title_asc";
