import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TransportBooking } from "../types/transport-booking.types";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

export function TransportBookingConfirmation({ booking }: { booking: TransportBooking }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Đặt xe thành công</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mã đặt xe #{booking.id} đã được xác nhận.
        </p>

        <div className="mt-8 space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-6 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tuyến đường</span>
            <span className="text-sm font-medium">
              {booking.routeOrigin} → {booking.routeDestination}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Xe</span>
            <span className="text-sm font-medium">{booking.vehicleName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ngày khởi hành</span>
            <span className="text-sm font-medium">{formatDate(booking.departureDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Số người</span>
            <span className="text-sm font-medium">{booking.numberOfPeople}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Người liên hệ</span>
            <span className="text-sm font-medium">{booking.customerName}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Tổng tiền</span>
            <span className="text-base font-bold text-primary">
              {formatPrice(booking.totalPrice, booking.currency)}
            </span>
          </div>
        </div>

        <Button nativeButton={false} render={<Link href="/transport" />} className="mt-8 rounded-full">
          Tiếp tục tìm chuyến khác
        </Button>
      </div>
    </main>
  );
}
