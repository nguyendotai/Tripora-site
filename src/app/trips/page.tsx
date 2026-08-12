"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useListTripsQuery } from "@/features/trip/api/trip.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function TripsList() {
  const { data, isLoading, isError } = useListTripsQuery();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Lịch trình của tôi</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Các chuyến đi bạn đã lên kế hoạch.
            </p>
          </div>
          <Button className="rounded-full" nativeButton={false} render={<Link href="/trips/new" />}>
            <Plus className="mr-1.5 h-4 w-4" /> Tạo lịch trình
          </Button>
        </div>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Đang tải...</p>
        ) : isError ? (
          <p className="mt-10 text-sm text-destructive">Không tải được lịch trình.</p>
        ) : !data || data.items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Bạn chưa có lịch trình nào</p>
            <p className="text-sm text-muted-foreground">
              Tạo lịch trình đầu tiên để bắt đầu lên kế hoạch cho chuyến đi.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {data.items.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="rounded-[var(--radius-lg)] border border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-semibold">{trip.title}</p>
                {(trip.startDate || trip.endDate) && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {trip.startDate?.slice(0, 10)}
                    {trip.endDate && ` → ${trip.endDate.slice(0, 10)}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function TripsPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <TripsList />
      </RequireAuth>
      <Footer />
    </>
  );
}
