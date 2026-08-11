import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/shared/components/scroll-reveal";
import { MOCK_GUIDES } from "../data/mock-guides";

export function TravelGuides() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Cẩm nang{" "}
          <span className="border-b-[3px] border-primary pb-1">du lịch</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Kinh nghiệm thật, viết bởi những người đã từng đi.
        </p>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-3">
        {MOCK_GUIDES.map((guide, index) => (
          <ScrollReveal key={guide.slug} delay={index * 0.1}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,.4)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={`https://picsum.photos/seed/${guide.seed}/700/450`}
                  alt={guide.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-3 top-3 rounded-full bg-background/90 text-foreground hover:bg-background/90">
                  <Clock className="mr-1 h-3 w-3" /> {guide.readMinutes} phút đọc
                </Badge>
              </div>
              <div className="p-4">
                <p className="font-semibold leading-snug">{guide.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {guide.excerpt}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
