'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const HERO_IMAGE = 'https://picsum.photos/seed/tripora-coastline-resort/1920/1080';

export function HeroSearch() {
  return (
    <section className="relative">
      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden pt-16 pb-28 sm:pb-32">
        <Image
          src={HERO_IMAGE}
          alt="Bờ biển với khu nghỉ dưỡng nhìn từ trên cao"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,14,23,.5) 0%, rgba(10,14,23,.85) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Chuyến đi tiếp theo bắt đầu ở đây
          </h1>
          <p className="max-w-xl text-base text-white/85 sm:text-lg">
            So sánh khách sạn, resort và tour tại các điểm đến nổi bật, đặt chỗ chỉ trong vài bước.
          </p>
        </div>
      </div>

      {/* Search Widget — nổi đè lên mép dưới Hero, xem frontend/CLAUDE.md mục 6.5 */}
      <div className="relative z-20 mx-auto -mt-20 max-w-4xl px-4 sm:-mt-16 sm:px-6">
        <div className="rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-lg sm:p-6">
          <Tabs defaultValue="property">
            <TabsList>
              <TabsTrigger value="property">Khách sạn</TabsTrigger>
              <TabsTrigger value="product">Tour & trải nghiệm</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Backend chưa có module Property/Booking — form chỉ mang tính trình bày, chưa điều hướng thật */}
          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-end"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="destination" className="text-xs font-medium text-muted-foreground">
                Điểm đến
              </label>
              <Input id="destination" placeholder="Bạn muốn đi đâu?" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="check-in" className="text-xs font-medium text-muted-foreground">
                Nhận phòng
              </label>
              <Input id="check-in" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="check-out" className="text-xs font-medium text-muted-foreground">
                Trả phòng
              </label>
              <Input id="check-out" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="guests" className="text-xs font-medium text-muted-foreground">
                Số khách
              </label>
              <Input id="guests" type="number" min={1} defaultValue={2} />
            </div>
            <Button type="submit" size="lg" className="rounded-full">
              <Search className="size-4" />
              Tìm kiếm
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
