import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/features/destination/types/destination.types";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const TILE_CLASSNAMES = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "",
];
const TILE_DELAYS = [0, 0.06, 0.12, 0.06, 0.18, 0.24];

export function PopularDestinations({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) return null;
  const tiles = destinations.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="border-b-[3px] border-primary pb-1">
              Điểm đến
            </span>{" "}
            nổi bật
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Những nơi được cộng đồng Tripora khám phá và lưu lại nhiều nhất.
          </p>
        </div>
        <Link
          href="/destinations"
          className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline"
        >
          Xem tất cả →
        </Link>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
        {tiles.map((destination, index) => (
          <ScrollReveal
            key={destination.id}
            delay={TILE_DELAYS[index]}
            className={TILE_CLASSNAMES[index]}
          >
            <DestinationTile destination={destination} tall={index === 0} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function DestinationTile({
  destination,
  tall = false,
}: {
  destination: Destination;
  tall?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative block h-full w-full overflow-hidden rounded-[var(--radius-xl)] transition-transform duration-300 hover:-translate-y-1 ${
        tall ? "aspect-[4/5] sm:aspect-auto" : "aspect-square sm:aspect-[4/3]"
      }`}
    >
      <Image
        src={destination.images?.[0] ?? `https://picsum.photos/seed/${destination.slug}/800/900`}
        alt={destination.name}
        fill
        sizes="(min-width: 768px) 50vw, 50vw"
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
  );
}
