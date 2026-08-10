import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '@/shared/components/scroll-reveal';

const DESTINATIONS = [
  { name: 'Đà Nẵng', href: '/destinations/da-nang', seed: 'tripora-da-nang-bridge', featured: true },
  { name: 'Hội An', href: '/destinations/hoi-an', seed: 'tripora-hoi-an-lanterns' },
  { name: 'Phú Quốc', href: '/destinations/phu-quoc', seed: 'tripora-phu-quoc-beach' },
  { name: 'Sa Pa', href: '/destinations/sa-pa', seed: 'tripora-sa-pa-terraces' },
  { name: 'Đà Lạt', href: '/destinations/da-lat', seed: 'tripora-da-lat-pines' },
];

export function PopularDestinations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <ScrollReveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">Điểm đến nổi bật</h2>
          <Link
            href="/destinations"
            className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Xem tất cả điểm đến
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="grid grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className={`group relative block overflow-hidden rounded-[var(--radius-xl)] ${
                destination.featured ? 'col-span-2 row-span-2 aspect-square sm:aspect-auto' : 'aspect-square'
              }`}
            >
              <Image
                src={`https://picsum.photos/seed/${destination.seed}/800/800`}
                alt={destination.name}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <span className="absolute bottom-3 left-4 text-base font-semibold text-white sm:text-lg">
                {destination.name}
              </span>
            </Link>
          ))}

          <Link
            href="/destinations"
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] bg-secondary text-secondary-foreground transition-colors hover:bg-muted"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ArrowUpRight className="size-5" />
            </span>
            <span className="text-sm font-medium">Xem tất cả</span>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
