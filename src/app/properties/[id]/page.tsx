import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, MapPin, Users, BedDouble } from 'lucide-react';
import { getProperty, listPropertyRooms } from '@/features/property';
import { BookingWidget } from '@/modules/property-detail/components/booking-widget';

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  HOTEL: 'Khách sạn',
  RESORT: 'Resort',
  VILLA: 'Villa',
  APARTMENT: 'Căn hộ',
  HOSTEL: 'Hostel',
  HOMESTAY: 'Homestay',
};

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;

  const property = await getProperty(id).catch(() => null);
  if (!property) {
    notFound();
  }

  const rooms = await listPropertyRooms(id).catch(() => []);
  const imageUrl = property.images?.[0] ?? `https://picsum.photos/seed/tripora-${property.slug}/1200/675`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="relative aspect-[16/7] overflow-hidden rounded-[var(--radius-xl)]">
        <Image src={imageUrl} alt={property.name} fill sizes="100vw" className="object-cover" priority />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
            {PROPERTY_TYPE_LABELS[property.type] ?? property.type}
          </span>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{property.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {[property.address, property.city, property.country].filter(Boolean).join(', ') || 'Chưa cập nhật'}
            </span>
            {property.ratingCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-current text-primary" />
                {Number(property.ratingAverage).toFixed(1)} ({property.ratingCount} đánh giá)
              </span>
            )}
          </div>

          {property.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {property.description}
            </p>
          )}

          {(property.checkInTime || property.checkOutTime) && (
            <div className="mt-6 flex gap-6 text-sm">
              {property.checkInTime && (
                <span>
                  <span className="text-muted-foreground">Nhận phòng: </span>
                  <span className="font-medium">{property.checkInTime}</span>
                </span>
              )}
              {property.checkOutTime && (
                <span>
                  <span className="text-muted-foreground">Trả phòng: </span>
                  <span className="font-medium">{property.checkOutTime}</span>
                </span>
              )}
            </div>
          )}

          {property.cancellationPolicy && (
            <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-4 text-sm">
              <h3 className="font-semibold">Chính sách hủy phòng</h3>
              <p className="mt-1 whitespace-pre-line text-muted-foreground">{property.cancellationPolicy}</p>
            </div>
          )}

          <h2 className="mt-10 text-xl font-bold">Hạng phòng</h2>
          {rooms.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Chỗ ở này chưa mở phòng nào.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {rooms.map((room) => (
                <div key={room.id} className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{room.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {room.capacityAdults} người lớn
                          {room.capacityChildren > 0 ? `, ${room.capacityChildren} trẻ em` : ''}
                        </span>
                        {room.bedType && (
                          <span className="flex items-center gap-1">
                            <BedDouble className="size-3.5" />
                            {room.bedType}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-primary">
                      {Number(room.basePrice).toLocaleString('vi-VN')}đ
                      <span className="font-normal text-muted-foreground"> /đêm</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            {rooms.length > 0 ? (
              <BookingWidget rooms={rooms} />
            ) : (
              <p className="rounded-[var(--radius-lg)] border border-border bg-card p-5 text-sm text-muted-foreground">
                Chưa có phòng nào để đặt.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
