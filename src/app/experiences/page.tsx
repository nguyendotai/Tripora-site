import { Compass, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDestinations } from "@/features/destination/services/get-destinations";
import { getExperiences } from "@/features/experience/services/get-experiences";
import type { ExperienceSort } from "@/features/experience/types/experience.types";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} đ`;
}

const SORT_OPTIONS: { value: ExperienceSort; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "title_asc", label: "Tên A-Z" },
];

function buildPageHref(
  params: { q?: string; destinationId?: string; sort?: string },
  page: number,
) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.destinationId) search.set("destinationId", params.destinationId);
  if (params.sort) search.set("sort", params.sort);
  search.set("page", String(page));
  return `/experiences?${search.toString()}`;
}

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    destinationId?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const sort: ExperienceSort = params.sort === "title_asc" ? "title_asc" : "newest";

  const [result, destinations] = await Promise.all([
    getExperiences({ q: params.q, destinationId: params.destinationId, sort, page }),
    getDestinations({ limit: 100 }),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Trải nghiệm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Các hoạt động, lớp học và trải nghiệm địa phương cho chuyến đi của bạn.
          </p>

          <form
            method="GET"
            className="mt-6 grid gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-end"
          >
            <div className="space-y-1.5">
              <label htmlFor="q" className="text-xs font-medium text-muted-foreground">
                Tên experience
              </label>
              <Input id="q" name="q" defaultValue={params.q} placeholder="Lớp làm gốm, chèo kayak..." />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="destinationId" className="text-xs font-medium text-muted-foreground">
                Điểm đến
              </label>
              <select
                id="destinationId"
                name="destinationId"
                defaultValue={params.destinationId ?? ""}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              >
                <option value="">Tất cả điểm đến</option>
                {destinations?.items.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sort" className="text-xs font-medium text-muted-foreground">
                Sắp xếp
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="rounded-full">
              <Search className="h-4 w-4" />
              Tìm
            </Button>
          </form>

          {!result || result.items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <Compass className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Không tìm thấy experience phù hợp</p>
              <p className="text-sm text-muted-foreground">
                Thử bỏ bớt bộ lọc hoặc tìm theo tên khác.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((experience, index) => (
                <ScrollReveal key={experience.id} delay={(index % 6) * 0.06}>
                  <Link
                    href={`/experiences/${experience.slug}`}
                    className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={
                          experience.images?.[0] ??
                          `https://picsum.photos/seed/experience-${experience.slug}/700/500`
                        }
                        alt={experience.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {experience.destination && (
                        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
                          {experience.destination.name}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-1 font-semibold">{experience.title}</p>
                      {experience.durationLabel && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="line-clamp-1">{experience.durationLabel}</span>
                        </p>
                      )}
                      <div className="mt-3 flex items-end justify-end gap-2">
                        <p className="shrink-0 text-right">
                          <span className="text-xs text-muted-foreground">từ </span>
                          <span className="font-bold text-primary">
                            {formatPrice(experience.price)}
                          </span>
                          <span className="text-xs text-muted-foreground">/người</span>
                        </p>
                      </div>
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
