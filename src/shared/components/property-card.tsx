import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import type { Property } from '@/features/property';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  HOTEL: 'Khách sạn',
  RESORT: 'Resort',
  VILLA: 'Villa',
  APARTMENT: 'Căn hộ',
  HOSTEL: 'Hostel',
  HOMESTAY: 'Homestay',
};

export function PropertyCard({ property }: { property: Property }) {
  const imageUrl = property.images?.[0] ?? `https://picsum.photos/seed/tripora-${property.slug}/600/450`;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <article className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-shadow group-hover:shadow-md">
        <div className="relative aspect-[4/3]">
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
          <Badge className="absolute left-3 top-3 bg-card text-card-foreground shadow-sm">
            {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
          </Badge>
        </div>
        <div className="flex flex-col gap-1 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold">{property.name}</h3>
            {property.ratingCount > 0 && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                <Star className="size-3 fill-current text-primary" />
                {Number(property.ratingAverage).toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {[property.city, property.country].filter(Boolean).join(', ') || 'Chưa cập nhật địa điểm'}
          </p>
        </div>
      </article>
    </Link>
  );
}
