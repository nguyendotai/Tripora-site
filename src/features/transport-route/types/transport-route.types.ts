export interface TransportRoute {
  id: string;
  providerId: string;
  origin: string;
  destination: string;
  vehicleType?: "CAR" | "SUV" | "VAN" | "BUS" | "MOTORBIKE" | null;
  price: string;
  currency: string;
  estimatedDuration?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
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

export interface PaginatedTransportRoutes {
  items: TransportRoute[];
  pagination: PaginationMeta;
}
