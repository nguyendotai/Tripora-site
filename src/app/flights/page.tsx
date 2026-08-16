import { Plane, PlaneTakeoff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAirports } from "@/features/airport/services/get-airports";
import { getFlights } from "@/features/flight/services/get-flights";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function airportLabel(airport: { code: string; city: string }) {
  return `${airport.code} — ${airport.city}`;
}

function buildPageHref(
  params: { departureAirportId?: string; arrivalAirportId?: string },
  page: number,
) {
  const search = new URLSearchParams();
  if (params.departureAirportId) search.set("departureAirportId", params.departureAirportId);
  if (params.arrivalAirportId) search.set("arrivalAirportId", params.arrivalAirportId);
  search.set("page", String(page));
  return `/flights?${search.toString()}`;
}

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: Promise<{ departureAirportId?: string; arrivalAirportId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const [airports, result] = await Promise.all([
    getAirports(),
    getFlights({
      departureAirportId: params.departureAirportId,
      arrivalAirportId: params.arrivalAirportId,
      page,
    }),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Chuyến bay</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm chuyến bay theo sân bay đi và đến, sau đó chọn ngày khởi hành phù hợp.
          </p>

          <form
            method="GET"
            className="mt-6 grid gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          >
            <div className="space-y-1.5">
              <label htmlFor="departureAirportId" className="text-xs font-medium text-muted-foreground">
                Sân bay đi
              </label>
              <select
                id="departureAirportId"
                name="departureAirportId"
                defaultValue={params.departureAirportId ?? ""}
                className="h-9 w-full rounded-full border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">Tất cả sân bay</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airportLabel(airport)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="arrivalAirportId" className="text-xs font-medium text-muted-foreground">
                Sân bay đến
              </label>
              <select
                id="arrivalAirportId"
                name="arrivalAirportId"
                defaultValue={params.arrivalAirportId ?? ""}
                className="h-9 w-full rounded-full border border-input bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">Tất cả sân bay</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airportLabel(airport)}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="rounded-full">
              <PlaneTakeoff className="h-4 w-4" />
              Tìm chuyến bay
            </Button>
          </form>

          {!result || result.items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <Plane className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Không tìm thấy chuyến bay phù hợp</p>
              <p className="text-sm text-muted-foreground">
                Thử bỏ bớt bộ lọc hoặc tìm theo sân bay đi/đến khác.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((flight, index) => (
                <ScrollReveal key={flight.id} delay={(index % 6) * 0.06}>
                  <Link
                    href={`/flights/${flight.id}`}
                    className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <Plane className="h-5 w-5 shrink-0" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {flight.flightNumber}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 font-semibold">
                      <span className="line-clamp-1">{flight.departureAirport?.code}</span>
                      <PlaneTakeoff className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-1">{flight.arrivalAirport?.code}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {flight.departureAirport?.city} → {flight.arrivalAirport?.city}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{flight.aircraft?.model}</span>
                      <span>{flight.duration} phút</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          {result && result.pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {result.pagination.hasPreviousPage && (
                <Link
                  href={buildPageHref(params, page - 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Trang trước
                </Link>
              )}
              <span className="px-2 text-sm text-muted-foreground">
                Trang {result.pagination.page} / {result.pagination.totalPages}
              </span>
              {result.pagination.hasNextPage && (
                <Link
                  href={buildPageHref(params, page + 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Trang sau
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
