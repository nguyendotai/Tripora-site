import Image from 'next/image';
import { Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { ScrollReveal } from '@/shared/components/scroll-reveal';

// Dữ liệu mẫu — sẽ thay bằng GET /properties thật khi module Property hoàn thành (xem specs/property.md)
const PROPERTIES = [
  {
    name: 'Ocean Pearl Resort',
    location: 'Đà Nẵng',
    type: 'Resort',
    rating: 4.8,
    price: '1.850.000đ',
    seed: 'tripora-ocean-pearl-resort',
  },
  {
    name: 'Hội An Riverside Villa',
    location: 'Hội An',
    type: 'Villa',
    rating: 4.7,
    price: '1.200.000đ',
    seed: 'tripora-hoi-an-riverside-villa',
  },
  {
    name: 'Sapa Cloud Homestay',
    location: 'Sa Pa',
    type: 'Homestay',
    rating: 4.6,
    price: '650.000đ',
    seed: 'tripora-sapa-cloud-homestay',
  },
  {
    name: 'Phú Quốc Sea Breeze Hotel',
    location: 'Phú Quốc',
    type: 'Khách sạn',
    rating: 4.5,
    price: '2.100.000đ',
    seed: 'tripora-phu-quoc-sea-breeze',
  },
];

export function FeaturedProperties() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <ScrollReveal>
        <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Chỗ ở được yêu thích</h2>
      </ScrollReveal>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {PROPERTIES.map((property, index) => (
          <ScrollReveal key={property.name} delay={index * 0.06}>
            <article className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
              <div className="relative aspect-[4/3]">
                <Image
                  src={`https://picsum.photos/seed/${property.seed}/600/450`}
                  alt={property.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
                <Badge className="absolute left-3 top-3 bg-card text-card-foreground shadow-sm">
                  {property.type}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{property.name}</h3>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                    <Star className="size-3 fill-current text-primary" />
                    {property.rating}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{property.location}</p>
                <p className="mt-2 text-sm">
                  Từ <span className="font-bold text-primary">{property.price}</span>
                  <span className="text-muted-foreground"> /đêm</span>
                </p>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
