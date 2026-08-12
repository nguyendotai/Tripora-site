"use client";

import { Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  useAddTripDayMutation,
  useDeleteTripMutation,
  useGetTripQuery,
} from "@/features/trip/api/trip.api";
import { TripDayCard } from "@/modules/trip-planner/components/trip-day-card";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function TripDetail() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const router = useRouter();

  const { data: trip, isLoading, isError } = useGetTripQuery(tripId);
  const [addDay, { isLoading: isAddingDay }] = useAddTripDayMutation();
  const [deleteTrip] = useDeleteTripMutation();

  const handleDeleteTrip = async () => {
    await deleteTrip(tripId).unwrap();
    router.push("/trips");
  };

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Đang tải...</p>;
  }

  if (isError || !trip) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-destructive">
        Không tìm thấy lịch trình này.
      </p>
    );
  }

  const days = [...trip.days].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{trip.title}</h1>
            {(trip.startDate || trip.endDate) && (
              <p className="mt-1 text-sm text-muted-foreground">
                {trip.startDate?.slice(0, 10)}
                {trip.endDate && ` → ${trip.endDate.slice(0, 10)}`}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 rounded-full text-destructive hover:text-destructive"
            onClick={handleDeleteTrip}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {days.map((day) => (
            <TripDayCard key={day.id} tripId={tripId} day={day} />
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full rounded-full"
          disabled={isAddingDay}
          onClick={() => addDay({ tripId })}
        >
          <Plus className="mr-1.5 h-4 w-4" /> {isAddingDay ? "Đang thêm..." : "Thêm ngày"}
        </Button>
      </div>
    </main>
  );
}

export default function TripDetailPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <TripDetail />
      </RequireAuth>
      <Footer />
    </>
  );
}
