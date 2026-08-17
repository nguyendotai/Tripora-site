export interface TourAvailabilityResult {
  available: boolean;
  availableSeats: number;
  pricePerPerson: string | null;
  currency: string;
}

export interface TourBooking {
  id: string;
  userId: string;
  tourId: string;
  tourTitle: string;
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
