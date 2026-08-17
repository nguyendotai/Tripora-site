export type ProviderType = "HOTEL" | "TOUR" | "ACTIVITY" | "TRANSPORT" | "FLIGHT";

export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface Provider {
  id: string;
  userId: string;
  type: ProviderType;
  name: string;
  description?: string | null;
  logo?: string | null;
  contact?: string | null;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
}
