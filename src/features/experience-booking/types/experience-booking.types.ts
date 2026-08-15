export interface ExperienceAvailabilityResult {
  available: boolean;
  availableSeats: number;
  pricePerPerson: string | null;
  currency: string;
}

export interface ExperienceBooking {
  id: string;
  userId: string;
  experienceId: string;
  experienceTitle: string;
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
