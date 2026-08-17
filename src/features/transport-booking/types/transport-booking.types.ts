import type { Vehicle } from "@/features/vehicle/types/vehicle.types";
import type { TransportSchedule } from "@/features/transport-schedule/types/transport-schedule.types";

export interface AvailableVehicleOption {
  schedule: TransportSchedule;
  vehicle: Vehicle;
}

export interface TransportBooking {
  id: string;
  userId: string;
  routeId: string;
  vehicleId: string;
  driverId?: string | null;
  routeOrigin: string;
  routeDestination: string;
  vehicleName: string;
  departureDate: string;
  numberOfPeople: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: "PENDING_PAYMENT" | "PAID" | "CONFIRMED" | "COMPLETED" | "EXPIRED" | "CANCELLED" | "REFUND_PENDING" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
}
