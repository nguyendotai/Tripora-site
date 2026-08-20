import Image from "next/image";
import Link from "next/link";
import type { Tour } from "@/features/tour/types/tour.types";
import { formatPrice } from "@/shared/utils/format-price";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

export function FeaturedTours({ tours }: { tours: Tour[] }) {
  if (tours.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="border-b-[3px] border-primary pb-1">Tour</span>{" "}
            được đặt nhiều nhất
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Những hành trình trọn gói được đặt nhiều nhất gần đây.
          </p>
        </div>
        <Link
          href="/tours"
          className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline"
        >
          Xem tất cả →
        </Link>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour, index) => (
          <ScrollReveal key={tour.id} delay={(index % 6) * 0.06}>
            <Link
              href={`/tours/${tour.slug}`}
              className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={
                    tour.images?.[0] ??
                    `https://picsum.photos/seed/tour-${tour.slug}/700/500`
                  }
                  alt={tour.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {tour.destination && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
                    {tour.destination.name}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-semibold">{tour.title}</p>
                {tour.durationLabel && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {tour.durationLabel}
                  </p>
                )}
                <p className="mt-3 text-right">
                  <span className="text-xs text-muted-foreground">từ </span>
                  <span className="font-bold text-primary">{formatPrice(tour.price)}</span>
                  <span className="text-xs text-muted-foreground">/người</span>
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
