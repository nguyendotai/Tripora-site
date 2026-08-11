import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDestinations } from "@/features/destination/services/get-destinations";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const result = await getDestinations({ q: params.q, page });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Điểm đến</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Khám phá tất cả điểm đến trên Tripora.
          </p>

          <form method="GET" className="mt-6 flex max-w-md gap-2">
            <Input name="q" defaultValue={params.q} placeholder="Tìm theo tên..." />
            <Button type="submit" size="icon" className="shrink-0 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {!result || result.items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <p className="font-medium">Chưa có điểm đến nào</p>
              <p className="text-sm text-muted-foreground">
                Dữ liệu sẽ hiển thị ngay khi Admin thêm điểm đến đầu tiên.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((destination, index) => (
                <ScrollReveal key={destination.id} delay={(index % 6) * 0.06}>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={
                          destination.images?.[0] ??
                          `https://picsum.photos/seed/${destination.slug}/700/500`
                        }
                        alt={destination.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground">
                        {destination.country}
                      </p>
                      <p className="font-semibold">{destination.name}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
