import type { PaginationMeta } from "@/features/destination/types/destination.types";

export interface Review {
  id: string;
  userId: string;
  destinationId?: string | null;
  propertyId?: string | null;
  rating: number;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export interface PaginatedReviews {
  items: Review[];
  pagination: PaginationMeta;
}

/** Home page — GET /reviews/highlights kem avatar + noi dung san pham duoc review, khac Review
 * dung cho ReviewSection (khong can 2 field nay vi da o dung trang cua san pham). */
export interface ReviewHighlight {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  };
  property: { id: string; name: string; slug: string } | null;
  destination: { id: string; name: string; slug: string } | null;
}
