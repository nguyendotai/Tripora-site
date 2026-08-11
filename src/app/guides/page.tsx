import { Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTravelGuides } from "@/features/travel-guide/services/get-travel-guides";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function estimateReadMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const result = await getTravelGuides({ q: params.q, page });

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold sm:text-3xl">Cẩm nang du lịch</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kinh nghiệm thật, viết bởi những người đã từng đi.
          </p>

          <form method="GET" className="mt-6 flex max-w-md gap-2">
            <Input name="q" defaultValue={params.q} placeholder="Tìm theo tiêu đề..." />
            <Button type="submit" size="icon" className="shrink-0 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {!result || result.items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-2 py-10 text-center">
              <p className="font-medium">Chưa có bài cẩm nang nào</p>
              <p className="text-sm text-muted-foreground">
                Nội dung sẽ hiển thị ngay khi Admin đăng bài đầu tiên.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((guide, index) => (
                <ScrollReveal key={guide.id} delay={(index % 6) * 0.06}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,.4)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={
                          guide.coverImage ??
                          `https://picsum.photos/seed/${guide.slug}/700/450`
                        }
                        alt={guide.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute left-3 top-3 rounded-full bg-background/90 text-foreground hover:bg-background/90">
                        <Clock className="mr-1 h-3 w-3" />
                        {estimateReadMinutes(guide.content)} phút đọc
                      </Badge>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold leading-snug">{guide.title}</p>
                      {guide.excerpt && (
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          {guide.excerpt}
                        </p>
                      )}
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
