import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TourBooking } from "../types/tour-booking.types";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

export function TourBookingConfirmation({ booking }: { booking: TourBooking }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Đặt tour thành công</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mã đặt tour #{booking.id} đã được xác nhận.
        </p>

        <div className="mt-8 space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-6 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Tour</span>
            <span className="text-sm font-medium">{booking.tourTitle}</span>
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

        <Button
          nativeButton={false}
          render={<Link href="/tours" />}
          className="mt-8 rounded-full"
        >
          Tiếp tục khám phá tour
        </Button>
      </div>
    </main>
  );
}
