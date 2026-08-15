import { serverFetch } from "@/shared/services/server-fetch";
import type { Room } from "../types/room.types";

export function getRoomsByProperty(propertyId: string) {
  return serverFetch<Room[]>(`/rooms?propertyId=${propertyId}`);
}
