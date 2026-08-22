"use client";

import { Building2, Car, Compass, MapPin, Plane, Route, Search, Ticket } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Airport } from "@/features/airport/types/airport.types";
import { trackSearchBeacon } from "@/shared/services/analytics";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CATEGORIES = [
  { value: "destinations", label: "Điểm đến", icon: MapPin },
  { value: "hotels", label: "Khách sạn", icon: Building2 },
  { value: "tours", label: "Tour", icon: Compass },
  { value: "experiences", label: "Trải nghiệm", icon: Ticket },
  { value: "transport", label: "Vận chuyển", icon: Car },
  { value: "flights", label: "Chuyến bay", icon: Plane },
  { value: "trip", label: "Lịch trình", icon: Route },
];

export function HeroSearch({ airports = [] }: { airports?: Airport[] }) {
  const userId = useAppSelector((state) => state.auth.user?.id);

  // V9 vong 4 — khong preventDefault, form van dieu huong GET binh thuong; chi ban 1 beacon
  // ghi nhan tu khoa tim kiem truoc khi trang chuyen huong.
  const handleSearchSubmit =
    (entityType: string) => (event: React.FormEvent<HTMLFormElement>) => {
      const query = new FormData(event.currentTarget).get("q");
      if (typeof query === "string") {
        trackSearchBeacon({ query, entityType, userId });
      }
    };

  return (
    <section className="relative">
      <div className="relative h-[560px] w-full overflow-hidden sm:h-[620px]">
        <Image
          src="https://images.unsplash.com/photo-1603852452378-a4e8d84324a2?w=1600&h=900&fit=crop&q=80&auto=format"
          alt="Cầu Vàng, Bà Nà Hills, Đà Nẵng"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,14,23,.5) 0%, rgba(10,14,23,.85) 100%)",
          }}
        />

        <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl"
          >
            Khám phá thế giới,{" "}
            <span className="text-accent-foreground">một hành trình</span> mỗi lần
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-xl text-base text-white/80 sm:text-lg"
          >
            Tripora giúp bạn tìm điểm đến, đọc cẩm nang thật và tự tay lên lịch
            trình cho chuyến đi tiếp theo.
          </motion.p>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 sm:-mt-20"
      >
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.35)] sm:p-4">
          <Tabs defaultValue="destinations">
            <div className="overflow-x-auto">
              <TabsList className="h-auto flex-nowrap gap-0.5 p-1">
                {CATEGORIES.map((category) => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    className="gap-1.5 px-3 py-1.5"
                  >
                    <category.icon className="h-4 w-4" /> {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="destinations" className="mt-3">
              <form
                action="/destinations"
                method="GET"
                onSubmit={handleSearchSubmit("destination")}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <Input
                  name="q"
                  placeholder="Bạn muốn đi đâu? Ví dụ: Đà Nẵng, Hội An..."
                  className="h-12 rounded-full px-5"
                />
                <Button type="submit" size="lg" className="h-12 shrink-0 rounded-full px-6">
                  <Search className="mr-1.5 h-4 w-4" /> Tìm kiếm
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="hotels" className="mt-3">
              <form
                action="/hotels"
                method="GET"
                onSubmit={handleSearchSubmit("property")}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <Input
                  name="q"
                  placeholder="Tên khách sạn, thành phố..."
                  className="h-12 rounded-full px-5"
                />
                <Button type="submit" size="lg" className="h-12 shrink-0 rounded-full px-6">
                  <Search className="mr-1.5 h-4 w-4" /> Tìm khách sạn
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="tours" className="mt-3">
              <form
                action="/tours"
                method="GET"
                onSubmit={handleSearchSubmit("tour")}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <Input
                  name="q"
                  placeholder="Tên tour, điểm đến..."
                  className="h-12 rounded-full px-5"
                />
                <Button type="submit" size="lg" className="h-12 shrink-0 rounded-full px-6">
                  <Search className="mr-1.5 h-4 w-4" /> Tìm tour
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="experiences" className="mt-3">
              <form
                action="/experiences"
                method="GET"
                onSubmit={handleSearchSubmit("experience")}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <Input
                  name="q"
                  placeholder="Lặn biển, chèo thuyền, leo núi..."
                  className="h-12 rounded-full px-5"
                />
                <Button type="submit" size="lg" className="h-12 shrink-0 rounded-full px-6">
                  <Search className="mr-1.5 h-4 w-4" /> Tìm trải nghiệm
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="transport" className="mt-3">
              <form action="/transport" method="GET" className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 space-y-1 text-left">
                  <Label htmlFor="hero-origin" className="sr-only">
                    Điểm đón
                  </Label>
                  <Input
                    id="hero-origin"
                    name="origin"
                    placeholder="Điểm đón"
                    className="h-12 rounded-full px-5"
                  />
                </div>
                <div className="flex-1 space-y-1 text-left">
                  <Label htmlFor="hero-destination" className="sr-only">
                    Điểm đến
                  </Label>
                  <Input
                    id="hero-destination"
                    name="destination"
                    placeholder="Điểm đến"
                    className="h-12 rounded-full px-5"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 shrink-0 rounded-full px-6">
                  <Search className="mr-1.5 h-4 w-4" /> Tìm xe
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="flights" className="mt-3">
              <form action="/flights" method="GET" className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 space-y-1 text-left">
                  <Label htmlFor="hero-departureAirportId" className="sr-only">
                    Sân bay đi
                  </Label>
                  <select
                    id="hero-departureAirportId"
                    name="departureAirportId"
                    className="h-12 w-full rounded-full border border-input bg-background px-5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="">Sân bay đi</option>
                    {airports.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        {airport.code} — {airport.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 space-y-1 text-left">
                  <Label htmlFor="hero-arrivalAirportId" className="sr-only">
                    Sân bay đến
                  </Label>
                  <select
                    id="hero-arrivalAirportId"
                    name="arrivalAirportId"
                    className="h-12 w-full rounded-full border border-input bg-background px-5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <option value="">Sân bay đến</option>
                    {airports.map((airport) => (
                      <option key={airport.id} value={airport.id}>
                        {airport.code} — {airport.city}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" size="lg" className="h-12 shrink-0 rounded-full px-6">
                  <Search className="mr-1.5 h-4 w-4" /> Tìm chuyến bay
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="trip" className="mt-3">
              <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] bg-muted px-4 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Tạo lịch trình theo ngày, thêm địa điểm muốn ghé và sắp xếp
                  hành trình theo cách của bạn.
                </p>
                <Button
                  size="lg"
                  className="shrink-0 rounded-full px-6"
                  nativeButton={false}
                  render={<a href="/trips/new" />}
                >
                  Tạo lịch trình
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </section>
  );
}
