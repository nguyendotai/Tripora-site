"use client";

import { CalendarX2, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCancelBookingMutation,
  useListMyBookingsQuery,
  type BookingStatusFilter,
} from "../api/booking.api";
import type { Booking } from "../types/booking.types";

const FILTERS: { value: BookingStatusFilter | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "upcoming", label: "Sắp tới" },
  { value: "completed", label: "Đã hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
];

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}

function isUpcoming(booking: Booking) {
  const today = new Date().toISOString().slice(0, 10);
  return booking.status === "CONFIRMED" && booking.checkOutDate.slice(0, 10) >= today;
}

function displayStatus(booking: Booking): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (booking.status === "CANCELLED") return { label: "Đã huỷ", variant: "destructive" };
  if (isUpcoming(booking)) return { label: "Sắp tới", variant: "default" };
  return { label: "Đã hoàn tất", variant: "secondary" };
}

function canCancel(booking: Booking) {
  const today = new Date().toISOString().slice(0, 10);
  return booking.status === "CONFIRMED" && booking.checkInDate.slice(0, 10) > today;
}

function BookingCard({ booking }: { booking: Booking }) {
  const [confirming, setConfirming] = useState(false);
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  const status = displayStatus(booking);

  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id).unwrap();
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{booking.propertyName}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {booking.roomName}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted-foreground">Nhận phòng</p>
          <p className="text-sm font-medium">{formatDate(booking.checkInDate)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Trả phòng</p>
          <p className="text-sm font-medium">{formatDate(booking.checkOutDate)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Số đêm</p>
          <p className="text-sm font-medium">{booking.nights}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tổng tiền</p>
          <p className="text-sm font-bold text-primary">
            {formatPrice(booking.totalPrice, booking.currency)}
          </p>
        </div>
      </div>

      {canCancel(booking) && (
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          {confirming ? (
            <>
              <p className="text-sm text-muted-foreground">Huỷ đặt phòng này?</p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="rounded-full"
                disabled={isLoading}
                onClick={handleCancel}
              >
                {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Xác nhận huỷ"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full"
                disabled={isLoading}
                onClick={() => setConfirming(false)}
              >
                Không
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setConfirming(true)}
            >
              Huỷ đặt phòng
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function BookingList({ status }: { status: BookingStatusFilter | undefined }) {
  const { data, isLoading, isError } = useListMyBookingsQuery(status);

  if (isLoading) {
    return <p className="mt-6 text-sm text-muted-foreground">Đang tải...</p>;
  }

  if (isError) {
    return <p className="mt-6 text-sm text-destructive">Không tải được danh sách đặt phòng.</p>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border py-14 text-center">
        <CalendarX2 className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium">Chưa có đặt phòng nào</p>
        <p className="text-sm text-muted-foreground">
          Khám phá và{" "}
          <Link href="/hotels" className="text-primary hover:underline">
            đặt khách sạn
          </Link>{" "}
          cho chuyến đi tiếp theo của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {data.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}

export function MyBookingsList() {
  const [filter, setFilter] = useState<BookingStatusFilter | "all">("all");

  return (
    <Tabs value={filter} onValueChange={(value) => setFilter(value as BookingStatusFilter | "all")}>
      <TabsList>
        {FILTERS.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={filter}>
        <BookingList status={filter === "all" ? undefined : filter} />
      </TabsContent>
    </Tabs>
  );
}
