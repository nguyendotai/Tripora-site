export interface TripItem {
  id: string;
  tripDayId: string;
  destinationId?: string | null;
  title: string;
  note?: string | null;
  sortOrder: number;
  destination?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface TripDay {
  id: string;
  tripId: string;
  dayNumber: number;
  date?: string | null;
  items: TripItem[];
}

export interface Trip {
  id: string;
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TripDetail extends Trip {
  days: TripDay[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTrips {
  items: Trip[];
  pagination: PaginationMeta;
}
