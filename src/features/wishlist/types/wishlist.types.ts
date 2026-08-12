import type { Destination } from "@/features/destination/types/destination.types";

export interface WishlistItem {
  id: string;
  userId: string;
  destinationId: string;
  createdAt: string;
  destination?: Destination;
}
