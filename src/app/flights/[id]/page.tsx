import { Clock3, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getFlightById } from "@/features/flight/services/get-flights";
import { getFlightSchedules } from "@/features/flight-schedule/services/get-flight-schedules";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default async function FlightDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flight = await getFlightById(id);

  if (!flight) {
    notFound();
  }

  const schedules = await getFlightSchedules(id, todayISO(), addDaysISO(90));
  const upcomingSchedules = schedules.filter((s) => s.status === "SCHEDULED");

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary">
              <Plane className="h-5 w-5" />
              <span className="text-sm font-medium">{flight.provider?.name}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{flight.flightNumber}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PlaneTakeoff className="h-4 w-4" />
                {flight.departureAirport?.code} — {flight.departureAirport?.name}
              </span>
              <span className="flex items-center gap-1.5">
                <PlaneLanding className="h-4 w-4" />
                {flight.arrivalAirport?.code} — {flight.arrivalAirport?.name}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {flight.duration} phút bay
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Máy bay: {flight.aircraft?.model} ({flight.aircraft?.registrationCode})
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="mt-8">
            <h2 className="text-xl font-bold">Chọn ngày khởi hành</h2>
            {upcomingSchedules.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Chưa có lịch bay nào mở bán trong 90 ngày tới.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {upcomingSchedules.map((schedule) => (
                  <Link
                    key={schedule.id}
                    href={`/flights/${flight.id}/book?scheduleId=${schedule.id}&date=${schedule.departureDate.slice(0, 10)}`}
                    className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium capitalize">{formatDate(schedule.departureDate)}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.departureTime} → {schedule.arrivalTime}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                      <p className="text-right">
                        <span className="block text-xs text-muted-foreground">Economy từ</span>
                        <span className="font-bold text-primary">
                          {formatPrice(schedule.economyPrice)}
                        </span>
                      </p>
                      {schedule.businessPrice && (
                        <p className="text-right">
                          <span className="block text-xs text-muted-foreground">Business từ</span>
                          <span className="font-bold text-primary">
                            {formatPrice(schedule.businessPrice)}
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
