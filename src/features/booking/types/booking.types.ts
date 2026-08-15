export interface AvailabilityResult {
  available: boolean;
  nights: number;
  totalPrice: string | null;
  currency: string;
  unavailableDates: string[];
}

export interface GuestInput {
  fullName: string;
  email?: string;
  phone?: string;
}

export interface Guest {
  id: string;
  bookingId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  propertyId: string;
  propertyName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: string;
  currency: string;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  guests: Guest[];
}
