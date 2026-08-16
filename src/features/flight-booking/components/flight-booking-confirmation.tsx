import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { FlightBooking } from "../types/flight-booking.types";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** E-ticket = chinh du lieu FlightBooking Backend tra ve (kem Passenger tren tung ghe) —
 * khong sinh file/PDF, dung tinh than mock data cua ca du an (xem phases/v5-flight-booking.md). */
export function FlightBookingConfirmation({ booking }: { booking: FlightBooking }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Đặt vé thành công</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mã đặt vé #{booking.id} đã được xác nhận. Đây là vé điện tử của bạn.
        </p>

        <div className="mt-8 space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-6 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Chuyến bay</span>
            <span className="text-sm font-medium">{booking.flightNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tuyến</span>
            <span className="text-sm font-medium">
              {booking.departureAirportCode} → {booking.arrivalAirportCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ngày giờ bay</span>
            <span className="text-sm font-medium">
              {formatDate(booking.departureDate)} · {booking.departureTime} - {booking.arrivalTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Người liên hệ</span>
            <span className="text-sm font-medium">{booking.customerName}</span>
          </div>

          <div className="border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Hành khách ({booking.numberOfPassengers})</span>
            <ul className="mt-2 space-y-1">
              {booking.passengers.map((passenger) => (
                <li key={passenger.id} className="flex justify-between text-sm">
                  <span>{passenger.fullName}</span>
                  <span className="text-muted-foreground">{passenger.idNumber}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Tổng tiền</span>
            <span className="text-base font-bold text-primary">
              {formatPrice(booking.totalPrice, booking.currency)}
            </span>
          </div>
        </div>

        <Button nativeButton={false} render={<Link href="/flights" />} className="mt-8 rounded-full">
          Tiếp tục tìm chuyến khác
        </Button>
      </div>
    </main>
  );
}
