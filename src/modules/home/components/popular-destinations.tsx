import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/features/destination/types/destination.types";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const MAX_TILES = 7;

export function PopularDestinations({ destinations }: { destinations: Destination[] }) {
  if (destinations.length === 0) return null;
  const tiles = destinations.slice(0, MAX_TILES);
  // Hang tren nhieu hon hang duoi (mosaic 2 hang) — tu chia deu theo so luong that co, khong
  // phu thuoc dung 7 tile nhu anh mau: it hon thi vong 1 rong hon, khong con hang 2 luon.
  const splitAt = Math.ceil(tiles.length / 2);
  const topRow = tiles.slice(0, splitAt);
  const bottomRow = tiles.slice(splitAt);

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

      <div className="flex flex-col gap-3 sm:gap-4">
        <DestinationRow destinations={topRow} aspect="aspect-[3/4]" delayOffset={0} />
        {bottomRow.length > 0 && (
          <DestinationRow destinations={bottomRow} aspect="aspect-[3/2]" delayOffset={0.12} />
        )}
      </div>
    </section>
  );
}

function DestinationRow({
  destinations,
  aspect,
  delayOffset,
}: {
  destinations: Destination[];
  aspect: string;
  delayOffset: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
      {destinations.map((destination, index) => (
        <ScrollReveal
          key={destination.id}
          delay={delayOffset + index * 0.06}
          className="sm:min-w-0 sm:flex-1"
        >
          <DestinationTile destination={destination} aspect={aspect} />
        </ScrollReveal>
      ))}
    </div>
  );
}

function DestinationTile({ destination, aspect }: { destination: Destination; aspect: string }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative block w-full overflow-hidden rounded-[var(--radius-xl)] transition-transform duration-300 hover:-translate-y-1 ${aspect}`}
    >
      <Image
        src={destination.images?.[0] ?? `https://picsum.photos/seed/${destination.slug}/800/900`}
        alt={destination.name}
        fill
        sizes="(min-width: 640px) 20vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        {destination.country && (
          <p className="text-[11px] font-medium text-white/70 sm:text-xs">
            {destination.country}
          </p>
        )}
        <p className="line-clamp-1 text-sm font-bold text-white sm:text-lg">{destination.name}</p>
      </div>
    </Link>
  );
}
