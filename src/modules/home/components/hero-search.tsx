"use client";

import { Compass, MapPin, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HeroSearch() {
  return (
    <section className="relative">
      <div className="relative h-[560px] w-full overflow-hidden sm:h-[620px]">
        <Image
          src="https://picsum.photos/seed/tripora-hero/1600/900"
          alt=""
          fill
          priority
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
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            Khám phá thế giới,{" "}
            <span className="text-accent-foreground">một hành trình</span> mỗi lần
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
            Tripora giúp bạn tìm điểm đến, đọc cẩm nang thật và tự tay lên lịch
            trình cho chuyến đi tiếp theo.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-3xl px-4 sm:-mt-20">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,.35)] sm:p-4">
          <Tabs defaultValue="destinations">
            <TabsList>
              <TabsTrigger value="destinations">
                <MapPin className="mr-1.5 h-4 w-4" /> Khám phá điểm đến
              </TabsTrigger>
              <TabsTrigger value="trip">
                <Compass className="mr-1.5 h-4 w-4" /> Lập lịch trình
              </TabsTrigger>
            </TabsList>

            <TabsContent value="destinations" className="mt-3">
              <form
                action="/destinations"
                method="GET"
                className="flex flex-col gap-2 sm:flex-row"
              >
                <Input
                  name="q"
                  placeholder="Bạn muốn đi đâu? Ví dụ: Đà Nẵng, Hội An..."
                  className="h-12 rounded-full px-5"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 shrink-0 rounded-full px-6"
                >
                  <Search className="mr-1.5 h-4 w-4" /> Tìm kiếm
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
      </div>
    </section>
  );
}
