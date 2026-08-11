import { Clock } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getTravelGuideBySlug } from "@/features/travel-guide/services/get-travel-guides";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function estimateReadMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getTravelGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative h-[320px] w-full overflow-hidden sm:h-[400px]">
          <Image
            src={guide.coverImage ?? `https://picsum.photos/seed/${guide.slug}/1600/900`}
            alt={guide.title}
            fill
            priority
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
            <Badge className="mb-3 rounded-full bg-white/90 text-foreground hover:bg-white/90">
              <Clock className="mr-1 h-3 w-3" />
              {estimateReadMinutes(guide.content)} phút đọc
            </Badge>
            <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">
              {guide.title}
            </h1>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          {guide.excerpt && (
            <p className="mb-6 text-lg text-muted-foreground">{guide.excerpt}</p>
          )}
          <p className="whitespace-pre-line leading-relaxed text-foreground/90">
            {guide.content}
          </p>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
