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
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}
