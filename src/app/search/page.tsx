import { Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBlogPosts } from "@/features/blog/services/get-blog-posts";
import { getDestinations } from "@/features/destination/services/get-destinations";
import { getTravelGuides } from "@/features/travel-guide/services/get-travel-guides";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const RESULT_LIMIT = 6;

function ResultCard({
  href,
  image,
  title,
  subtitle,
}: {
  href: string;
  image: string;
  title: string;
  subtitle?: string | null;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="font-semibold leading-snug">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </Link>
  );
}

function ResultSection({
  title,
  seeAllHref,
  children,
}: {
  title: string;
  seeAllHref: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-10 first:mt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link href={seeAllHref} className="text-sm font-medium text-primary hover:underline">
          Xem tất cả
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  const [destinations, guides, blogPosts] = query
    ? await Promise.all([
        getDestinations({ q: query }),
        getTravelGuides({ q: query }),
        getBlogPosts({ q: query }),
      ])
    : [null, null, null];

  const totalResults =
    (destinations?.items.length ?? 0) +
    (guides?.items.length ?? 0) +
    (blogPosts?.items.length ?? 0);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Tìm kiếm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm điểm đến, cẩm nang và bài viết blog trên Tripora.
          </p>

          <form method="GET" className="mt-6 flex max-w-md gap-2">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Bạn muốn tìm gì? Ví dụ: Đà Nẵng..."
              autoFocus
            />
            <Button type="submit" size="icon" className="shrink-0 rounded-full">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </form>

          {!query ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <p className="font-medium">Nhập từ khoá để bắt đầu tìm kiếm</p>
              <p className="text-sm text-muted-foreground">
                Kết quả sẽ gồm cả Điểm đến, Cẩm nang và Blog.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <p className="font-medium">Không tìm thấy kết quả cho &quot;{query}&quot;</p>
              <p className="text-sm text-muted-foreground">
                Thử một từ khoá khác hoặc kiểm tra lại chính tả.
              </p>
            </div>
          ) : (
            <ScrollReveal>
              {destinations && destinations.items.length > 0 && (
                <ResultSection
                  title="Điểm đến"
                  seeAllHref={`/destinations?q=${encodeURIComponent(query)}`}
                >
                  {destinations.items.slice(0, RESULT_LIMIT).map((destination) => (
                    <ResultCard
                      key={destination.id}
                      href={`/destinations/${destination.slug}`}
                      image={
                        destination.images?.[0] ??
                        `https://picsum.photos/seed/${destination.slug}/700/500`
                      }
                      title={destination.name}
                      subtitle={destination.country}
                    />
                  ))}
                </ResultSection>
              )}

              {guides && guides.items.length > 0 && (
                <ResultSection
                  title="Cẩm nang"
                  seeAllHref={`/guides?q=${encodeURIComponent(query)}`}
                >
                  {guides.items.slice(0, RESULT_LIMIT).map((guide) => (
                    <ResultCard
                      key={guide.id}
                      href={`/guides/${guide.slug}`}
                      image={
                        guide.coverImage ?? `https://picsum.photos/seed/${guide.slug}/700/450`
                      }
                      title={guide.title}
                      subtitle={guide.excerpt}
                    />
                  ))}
                </ResultSection>
              )}

              {blogPosts && blogPosts.items.length > 0 && (
                <ResultSection title="Blog" seeAllHref={`/blog?q=${encodeURIComponent(query)}`}>
                  {blogPosts.items.slice(0, RESULT_LIMIT).map((post) => (
                    <ResultCard
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      image={post.coverImage ?? `https://picsum.photos/seed/${post.slug}/700/450`}
                      title={post.title}
                      subtitle={post.excerpt}
                    />
                  ))}
                </ResultSection>
              )}
            </ScrollReveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
