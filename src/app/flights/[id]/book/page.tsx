import { notFound } from "next/navigation";
import { getFlightById } from "@/features/flight/services/get-flights";
import { getFlightSchedules } from "@/features/flight-schedule/services/get-flight-schedules";
import { FlightBookingForm } from "@/features/flight-booking/components/flight-booking-form";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

export default async function BookFlightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scheduleId?: string; date?: string }>;
}) {
  const { id } = await params;
  const { scheduleId, date } = await searchParams;

  if (!scheduleId || !date) {
    notFound();
  }

  const flight = await getFlightById(id);
  if (!flight) {
    notFound();
  }

  const schedules = await getFlightSchedules(id, date, date);
  const schedule = schedules.find((s) => s.id === scheduleId);
  if (!schedule) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <RequireAuth>
        <FlightBookingForm flight={flight} schedule={schedule} />
      </RequireAuth>
      <Footer />
    </>
  );
}
