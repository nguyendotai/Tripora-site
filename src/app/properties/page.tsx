import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PropertyCard } from '@/shared/components/property-card';
import { listProperties } from '@/features/property';
import { getDestinations } from '@/features/destination';
import { cn } from '@/shared/lib/utils';

const PROPERTY_TYPES = [
  { value: '', label: 'Tất cả loại hình' },
  { value: 'HOTEL', label: 'Khách sạn' },
  { value: 'RESORT', label: 'Resort' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'APARTMENT', label: 'Căn hộ' },
  { value: 'HOSTEL', label: 'Hostel' },
  { value: 'HOMESTAY', label: 'Homestay' },
];

interface PropertiesPageProps {
  searchParams: Promise<{ q?: string; destinationId?: string; type?: string; page?: string }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) || 1 : 1;

  const [destinations, result] = await Promise.all([
    getDestinations({ limit: 50 }),
    listProperties({
      q: params.q,
      destinationId: params.destinationId,
      type: params.type,
      page,
      limit: 12,
    }).catch(() => ({ items: [], pagination: { page: 1, limit: 12, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false } })),
  ]);

  const buildPageHref = (targetPage: number) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.destinationId) query.set('destinationId', params.destinationId);
    if (params.type) query.set('type', params.type);
    query.set('page', String(targetPage));
    return `/properties?${query.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Tìm chỗ ở</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {result.pagination.totalItems} chỗ ở đang mở đặt phòng trên Tripora
      </p>

      <form method="GET" className="mt-6 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" placeholder="Tìm theo tên chỗ ở..." defaultValue={params.q} className="pl-9" />
        </div>
        <select
          name="destinationId"
          defaultValue={params.destinationId ?? ''}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-48"
        >
          <option value="">Tất cả điểm đến</option>
          {destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={params.type ?? ''}
          className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-44"
        >
          {PROPERTY_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button type="submit" className="rounded-full">
          Tìm kiếm
        </Button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {result.items.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {result.items.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          Không tìm thấy chỗ ở phù hợp. Thử đổi bộ lọc tìm kiếm.
        </p>
      )}

      {result.pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Link
            href={buildPageHref(page - 1)}
            aria-disabled={!result.pagination.hasPreviousPage}
            className={cn(
              'rounded-full border border-border px-4 py-2 text-sm font-medium',
              !result.pagination.hasPreviousPage && 'pointer-events-none opacity-40',
            )}
          >
            Trước
          </Link>
          <span className="text-sm text-muted-foreground">
            Trang {result.pagination.page}/{result.pagination.totalPages}
          </span>
          <Link
            href={buildPageHref(page + 1)}
            aria-disabled={!result.pagination.hasNextPage}
            className={cn(
              'rounded-full border border-border px-4 py-2 text-sm font-medium',
              !result.pagination.hasNextPage && 'pointer-events-none opacity-40',
            )}
          >
            Sau
          </Link>
        </div>
      )}
    </div>
  );
}
