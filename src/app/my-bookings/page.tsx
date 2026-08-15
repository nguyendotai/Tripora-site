"use client";

import { MyBookingsList } from "@/features/booking/components/my-bookings-list";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function MyBookingsContent() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Đặt chỗ của tôi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi và quản lý các lượt đặt phòng khách sạn của bạn.
        </p>
        <MyBookingsList />
      </div>
    </main>
  );
}

export default function MyBookingsPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <MyBookingsContent />
      </RequireAuth>
      <Footer />
    </>
  );
}
