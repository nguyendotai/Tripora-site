"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetRecommendedDestinationsQuery } from "@/features/destination/api/destination.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

/** V8 — "Goi y cho ban", ca nhan hoa theo hanh vi (Wishlist/Booking/Review). Khac moi section
 * Home khac (deu Server Component fetch qua server-fetch.ts) vi can Access Token dang luu trong
 * Redux — Server Component khong doc duoc, nen phai la Client Component tu goi RTK Query. */
export function RecommendedDestinations() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { data: destinations } = useGetRecommendedDestinationsQuery(undefined, {
    skip: !accessToken,
  });

  if (!accessToken || !destinations || destinations.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">
          <span className="border-b-[3px] border-primary pb-1">Gợi ý</span> cho bạn
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Chọn theo những nơi bạn đã lưu, đặt chỗ và đánh giá.
        </p>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((destination, index) => (
          <ScrollReveal key={destination.id} delay={(index % 6) * 0.06}>
            <Link
              href={`/destinations/${destination.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] transition-transform duration-300 hover:-translate-y-1"
            >
              <Image
                src={
                  destination.images?.[0] ??
                  `https://picsum.photos/seed/${destination.slug}/700/500`
                }
                alt={destination.name}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                {destination.country && (
                  <p className="text-xs font-medium text-white/70">{destination.country}</p>
                )}
                <p className="text-lg font-bold text-white">{destination.name}</p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
