import { CalendarDays, MapPin, Users } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTourBySlug } from "@/features/tour/services/get-tours";
import { getTourItinerary } from "@/features/tour-itinerary/services/get-tour-itinerary";
import { getTourSchedule } from "@/features/tour-schedule/services/get-tour-schedule";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const [itinerary, schedule] = await Promise.all([
    getTourItinerary(tour.id),
    getTourSchedule(tour.id, todayISO(), addDaysISO(60)),
  ]);

  const upcomingDepartures = (schedule ?? []).filter((row) => row.available > 0);

  const heroImage =
    tour.images?.[0] ?? `https://picsum.photos/seed/tour-${tour.slug}/1600/900`;
  const galleryImages = tour.images?.slice(1) ?? [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative h-[360px] w-full overflow-hidden sm:h-[440px]">
          <Image
            src={heroImage}
            alt={tour.title}
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
            {tour.destination && (
              <p className="text-sm font-medium text-white/80">{tour.destination.name}</p>
            )}
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{tour.title}</h1>
            {tour.durationLabel && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
                <CalendarDays className="h-4 w-4 shrink-0" />
                {tour.durationLabel}
              </p>
            )}
          </ScrollReveal>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-10 lg:col-span-2">
            <ScrollReveal>
              <h2 className="text-xl font-bold">Tổng quan</h2>
              <p className="mt-2 whitespace-pre-line text-foreground/90">
                {tour.description ?? "Chưa có mô tả cho tour này."}
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
                        alt={`${tour.title} - ảnh ${index + 2}`}
                        fill
                        sizes="(min-width: 1024px) 20vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <h2 className="text-xl font-bold">Lịch trình</h2>
              {!itinerary || itinerary.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Chưa có lịch trình chi tiết cho tour này.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {itinerary.map((day) => (
                    <div
                      key={day.id}
                      className="rounded-[var(--radius-lg)] border border-border bg-card p-4"
                    >
                      <p className="text-xs font-medium text-primary">Ngày {day.dayNumber}</p>
                      <p className="mt-0.5 font-semibold">{day.title}</p>
                      {day.activities && (
                        <p className="mt-2 text-sm text-foreground/90">{day.activities}</p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {day.meals && <span>Bữa ăn: {day.meals}</span>}
                        {day.locations && <span>Địa điểm: {day.locations}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-2">
              <ScrollReveal>
                <h2 className="text-xl font-bold">Bao gồm</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">
                  {tour.included ?? "Chưa cập nhật."}
                </p>
              </ScrollReveal>
              <ScrollReveal>
                <h2 className="text-xl font-bold">Không bao gồm</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-foreground/90">
                  {tour.excluded ?? "Chưa cập nhật."}
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <h2 className="text-xl font-bold">Ngày khởi hành</h2>
              {upcomingDepartures.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Chưa có ngày khởi hành nào mở bán trong 60 ngày tới.
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {upcomingDepartures.map((row) => (
                    <Badge key={row.id} variant="secondary" className="rounded-full py-1.5">
                      {formatDate(row.departureDate)} — còn {row.available} chỗ
                    </Badge>
                  ))}
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="text-xl font-bold">Hướng dẫn viên</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tour này chưa có hướng dẫn viên được chỉ định.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="text-xl font-bold">Đánh giá</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Tính năng đánh giá tour chưa được hỗ trợ.
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <p className="text-right">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(tour.price, tour.currency)}
                </span>
                <span className="text-sm text-muted-foreground"> /người</span>
              </p>
              <Button
                nativeButton={false}
                render={<Link href={`/tours/${tour.slug}/book`} />}
                className="mt-4 w-full rounded-full"
              >
                Đặt tour
              </Button>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h3 className="font-semibold">Thông tin chung</h3>
              <dl className="mt-2 space-y-2 text-sm">
                {tour.durationLabel && (
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" /> Thời lượng
                    </dt>
                    <dd>{tour.durationLabel}</dd>
                  </div>
                )}
                {tour.maxParticipants && (
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> Số người tối đa
                    </dt>
                    <dd>{tour.maxParticipants}</dd>
                  </div>
                )}
                {tour.destination && (
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> Điểm đến
                    </dt>
                    <dd>{tour.destination.name}</dd>
                  </div>
                )}
              </dl>
            </div>

            {tour.cancellationPolicy && (
              <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
                <h3 className="font-semibold">Chính sách huỷ</h3>
                <p className="mt-2 whitespace-pre-line text-xs text-muted-foreground">
                  {tour.cancellationPolicy}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
