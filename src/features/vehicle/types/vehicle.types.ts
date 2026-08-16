export type VehicleType = "CAR" | "SUV" | "VAN" | "BUS" | "MOTORBIKE";

export interface Vehicle {
  id: string;
  providerId: string;
  type: VehicleType;
  name: string;
  model?: string | null;
  capacity: number;
  features?: string[] | null;
  licensePlate: string;
  images?: string[] | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}
