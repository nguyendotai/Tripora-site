"use client";

import Image from "next/image";
import Link from "next/link";
import { useListWishlistQuery } from "@/features/wishlist/api/wishlist.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";
import { WishlistButton } from "@/shared/components/wishlist-button";

function WishlistGrid() {
  const { data, isLoading, isError } = useListWishlistQuery();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Điểm đến yêu thích</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Những điểm đến bạn đã lưu lại để đi sau.
        </p>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Đang tải...</p>
        ) : isError ? (
          <p className="mt-10 text-sm text-destructive">Không tải được danh sách yêu thích.</p>
        ) : !data || data.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Bạn chưa lưu điểm đến nào</p>
            <p className="text-sm text-muted-foreground">
              Nhấn biểu tượng trái tim trên điểm đến để lưu vào đây.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => {
              const destination = item.destination;
              if (!destination) return null;
              return (
                <Link
                  key={item.id}
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
                    <WishlistButton destinationId={destination.id} className="absolute right-3 top-3" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground">{destination.country}</p>
                    <p className="font-semibold">{destination.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <WishlistGrid />
      </RequireAuth>
      <Footer />
    </>
  );
}
