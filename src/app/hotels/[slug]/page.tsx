import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getPropertyBySlug } from "@/features/property/services/get-properties";
import { ReviewSection } from "@/features/review/components/review-section";
import { getRoomsByProperty } from "@/features/room/services/get-rooms";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const rooms = (await getRoomsByProperty(property.id)) ?? [];

  const heroImage =
    property.images?.[0] ?? `https://picsum.photos/seed/hotel-${property.slug}/1600/900`;
  const galleryImages = property.images?.slice(1) ?? [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative h-[360px] w-full overflow-hidden sm:h-[440px]">
          <Image
            src={heroImage}
            alt={property.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,14,23,.2) 0%, rgba(10,14,23,.75) 100%)",
            }}
          />
          <ScrollReveal className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            {property.destination && (
              <p className="text-sm font-medium text-white/80">{property.destination.name}</p>
            )}
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{property.name}</h1>
            {property.address && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
                <MapPin className="h-4 w-4 shrink-0" />
                {property.address}
              </p>
            )}
          </ScrollReveal>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-10 lg:col-span-2">
            <ScrollReveal>
              <h2 className="text-xl font-bold">Tổng quan</h2>
              <p className="mt-2 whitespace-pre-line text-foreground/90">
                {property.description ?? "Chưa có mô tả cho khách sạn này."}
              </p>
            </ScrollReveal>

            {galleryImages.length > 0 && (
              <ScrollReveal>
                <h2 className="text-xl font-bold">Hình ảnh</h2>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {galleryImages.map((src, index) => (
                    <div
                      key={src + index}
                      className="relative aspect-square overflow-hidden rounded-[var(--radius-md)]"
                    >
                      <Image
                        src={src}
                        alt={`${property.name} - ảnh ${index + 2}`}
                        fill
                        sizes="(min-width: 1024px) 20vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {property.amenities && property.amenities.length > 0 && (
              <ScrollReveal>
                <h2 className="text-xl font-bold">Tiện ích</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="rounded-full">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <h2 className="text-xl font-bold">Loại phòng</h2>
              {rooms.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Khách sạn chưa mở bán loại phòng nào.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 sm:flex-row sm:items-center"
                    >
                      <div className="relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-[var(--radius-md)] sm:block">
                        <Image
                          src={
                            room.images?.[0] ??
                            `https://picsum.photos/seed/room-${room.id}/300/200`
                          }
                          alt={room.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{room.name}</p>
                        {room.capacity && (
                          <p className="text-sm text-muted-foreground">
                            Tối đa {room.capacity} khách
                          </p>
                        )}
                        {room.amenities && room.amenities.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {room.amenities.slice(0, 4).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <p className="text-right">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(room.basePrice, room.currency)}
                          </span>
                          <span className="text-xs text-muted-foreground"> /đêm</span>
                        </p>
                        <Link
                          href={`/hotels/${property.slug}/book?roomId=${room.id}`}
                          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Đặt phòng
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal>
              <ReviewSection target={{ propertyId: property.id }} />
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h3 className="font-semibold">Vị trí</h3>
              {property.address ? (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  {property.address}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Chưa cập nhật địa chỉ.</p>
              )}
            </div>

            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h3 className="font-semibold">Chính sách</h3>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nhận phòng</dt>
                  <dd>{property.checkInTime ?? "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Trả phòng</dt>
                  <dd>{property.checkOutTime ?? "—"}</dd>
                </div>
              </dl>
              {property.policies && (
                <p className="mt-3 whitespace-pre-line text-xs text-muted-foreground">
                  {property.policies}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
