export type SeatClass = "ECONOMY" | "BUSINESS";
export type FlightSeatStatus = "AVAILABLE" | "BOOKED";

export interface FlightSeat {
  id: string;
  scheduleId: string;
  seatNumber: string;
  class: SeatClass;
  status: FlightSeatStatus;
}
