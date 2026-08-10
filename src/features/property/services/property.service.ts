import { serverFetch } from '@/shared/services/server-fetch';
import type { ListPropertiesParams, PaginatedResult, Property, Room } from '../types/property.types';

export function listProperties(params: ListPropertiesParams = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.destinationId) query.set('destinationId', params.destinationId);
  if (params.type) query.set('type', params.type);
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 12));

  return serverFetch<PaginatedResult<Property>>(`/properties?${query.toString()}`);
}

export function getProperty(id: string) {
  return serverFetch<Property>(`/properties/${id}`);
}

export function listPropertyRooms(propertyId: string) {
  return serverFetch<Room[]>(`/properties/${propertyId}/rooms`);
}
