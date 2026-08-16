import { Car, MoveRight, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTransportRoutes } from "@/features/transport-route/services/get-transport-routes";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function buildPageHref(params: { origin?: string; destination?: string }, page: number) {
  const search = new URLSearchParams();
  if (params.origin) search.set("origin", params.origin);
  if (params.destination) search.set("destination", params.destination);
  search.set("page", String(page));
  return `/transport?${search.toString()}`;
}

export default async function TransportPage({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string; destination?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const result = await getTransportRoutes({
    origin: params.origin,
    destination: params.destination,
    page,
  });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Vận chuyển</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm chuyến đưa đón, thuê xe theo tuyến cho hành trình của bạn.
          </p>

          <form
            method="GET"
            className="mt-6 grid gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
          >
            <div className="space-y-1.5">
              <label htmlFor="origin" className="text-xs font-medium text-muted-foreground">
                Điểm đón
              </label>
              <Input id="origin" name="origin" defaultValue={params.origin} placeholder="Sân bay Tân Sơn Nhất..." />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="destination" className="text-xs font-medium text-muted-foreground">
                Điểm đến
              </label>
              <Input
                id="destination"
                name="destination"
                defaultValue={params.destination}
                placeholder="Quận 1, TP.HCM..."
              />
            </div>

            <Button type="submit" className="rounded-full">
              <Search className="h-4 w-4" />
              Tìm
            </Button>
          </form>

          {!result || result.items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <Car className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Không tìm thấy tuyến phù hợp</p>
              <p className="text-sm text-muted-foreground">
                Thử bỏ bớt bộ lọc hoặc tìm theo điểm đón/đến khác.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((route, index) => (
                <ScrollReveal key={route.id} delay={(index % 6) * 0.06}>
                  <Link
                    href={`/transport/${route.id}/book`}
                    className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <Car className="h-5 w-5 shrink-0" />
                      {route.estimatedDuration && (
                        <span className="text-xs font-medium text-muted-foreground">
                          {route.estimatedDuration}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 flex items-center gap-1.5 font-semibold">
                      <span className="line-clamp-1">{route.origin}</span>
                      <MoveRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="line-clamp-1">{route.destination}</span>
                    </p>
                    <div className="mt-3 flex items-end justify-end">
                      <p className="shrink-0 text-right">
                        <span className="text-xs text-muted-foreground">từ </span>
                        <span className="font-bold text-primary">
                          {formatPrice(route.price, route.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground">/người</span>
                      </p>
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
