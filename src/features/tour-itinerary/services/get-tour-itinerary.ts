import { serverFetch } from "@/shared/services/server-fetch";
import type { TourItinerary } from "../types/tour-itinerary.types";

export function getTourItinerary(tourId: string) {
  return serverFetch<TourItinerary[]>(`/tour-itineraries?tourId=${tourId}`);
}
