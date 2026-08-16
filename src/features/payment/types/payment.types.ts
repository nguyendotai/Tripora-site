export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type BookingDomain = "HOTEL" | "TOUR" | "EXPERIENCE" | "TRANSPORT" | "FLIGHT";

export interface Payment {
  id: string;
  userId: string;
  bookingDomain: BookingDomain;
  bookingId: string;
  amount: string;
  currency: string;
  provider: string;
  method?: string | null;
  status: PaymentStatus;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
