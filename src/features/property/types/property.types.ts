export interface Property {
  id: string;
  partnerId: string;
  destinationId: string;
  type: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  images: string[] | null;
  amenities: string[] | null;
  ratingAverage: string;
  ratingCount: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  cancellationPolicy: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  type: string | null;
  capacityAdults: number;
  capacityChildren: number;
  bedType: string | null;
  amenities: string[] | null;
  images: string[] | null;
  basePrice: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomAvailability {
  id: string;
  roomId: string;
  date: string;
  total: number;
  available: number;
  price: string;
  status: string;
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

export interface ListPropertiesParams {
  q?: string;
  destinationId?: string;
  type?: string;
  page?: number;
  limit?: number;
}
