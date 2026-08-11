import Image from "next/image";
import Link from "next/link";
import { MOCK_DESTINATIONS } from "../data/mock-destinations";

export function PopularDestinations() {
  const [first, second, third, fourth, fifth, sixth] = MOCK_DESTINATIONS;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
        <DestinationTile destination={first} className="md:col-span-2 md:row-span-2" tall />
        <DestinationTile destination={second} />
        <DestinationTile destination={third} />
        <DestinationTile destination={fourth} className="md:col-span-2" />
        <DestinationTile destination={fifth} />
        <DestinationTile destination={sixth} />
      </div>
    </section>
  );
}

function DestinationTile({
  destination,
  className = "",
  tall = false,
}: {
  destination: (typeof MOCK_DESTINATIONS)[number];
  className?: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative block overflow-hidden rounded-[var(--radius-xl)] ${
        tall ? "aspect-[4/5] sm:aspect-auto" : "aspect-square sm:aspect-[4/3]"
      } ${className}`}
    >
      <Image
        src={`https://picsum.photos/seed/${destination.seed}/800/900`}
        alt={destination.name}
        fill
        sizes="(min-width: 768px) 50vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-xs font-medium text-white/70">
          {destination.country}
        </p>
        <p className="text-lg font-bold text-white">{destination.name}</p>
      </div>
    </Link>
  );
}
