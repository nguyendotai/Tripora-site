import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/features/property/types/property.types";
import { formatPrice } from "@/shared/utils/format-price";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="border-b-[3px] border-primary pb-1">
              Khách sạn
            </span>{" "}
            được đặt nhiều nhất
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Những chỗ nghỉ khách du lịch Tripora chọn đặt nhiều nhất gần đây.
          </p>
        </div>
        <Link
          href="/hotels"
          className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline"
        >
          Xem tất cả →
        </Link>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => (
          <ScrollReveal key={property.id} delay={(index % 6) * 0.06}>
            <Link
              href={`/hotels/${property.slug}`}
              className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={
                    property.images?.[0] ??
                    `https://picsum.photos/seed/hotel-${property.slug}/700/500`
                  }
                  alt={property.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {property.destination && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
                    {property.destination.name}
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-semibold">{property.name}</p>
                {property.address && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {property.address}
                  </p>
                )}
                {property.fromPrice && (
                  <p className="mt-3 text-right">
                    <span className="text-xs text-muted-foreground">từ </span>
                    <span className="font-bold text-primary">
                      {formatPrice(property.fromPrice)}
                    </span>
                    <span className="text-xs text-muted-foreground">/đêm</span>
                  </p>
                )}
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
