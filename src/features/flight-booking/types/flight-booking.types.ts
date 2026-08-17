export interface FlightBookingPassenger {
  id: string;
  seatId: string;
  fullName: string;
  idNumber: string;
}

export interface FlightBooking {
  id: string;
  userId: string;
  scheduleId: string;
  flightNumber: string;
  departureAirportCode: string;
  arrivalAirportCode: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  numberOfPassengers: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  totalPrice: string;
  currency: string;
  status: "PENDING_PAYMENT" | "PAID" | "CONFIRMED" | "COMPLETED" | "EXPIRED" | "CANCELLED" | "REFUND_PENDING" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  passengers: FlightBookingPassenger[];
}
