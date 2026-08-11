import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getDestinationBySlug } from "@/features/destination/services/get-destinations";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative h-[360px] w-full overflow-hidden sm:h-[440px]">
          <Image
            src={
              destination.images?.[0] ??
              `https://picsum.photos/seed/${destination.slug}/1600/900`
            }
            alt={destination.name}
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
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            {destination.country && (
              <p className="text-sm font-medium text-white/80">
                {destination.country}
              </p>
            )}
            <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
              {destination.name}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          {destination.tags && destination.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {destination.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <p className="whitespace-pre-line text-foreground/90">
            {destination.description ?? "Chưa có mô tả cho điểm đến này."}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
