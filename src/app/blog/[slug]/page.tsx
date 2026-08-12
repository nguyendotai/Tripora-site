import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogPostBySlug } from "@/features/blog/services/get-blog-posts";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="relative h-[320px] w-full overflow-hidden sm:h-[400px]">
          <Image
            src={post.coverImage ?? `https://picsum.photos/seed/${post.slug}/1600/900`}
            alt={post.title}
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
            <h1 className="max-w-3xl text-3xl font-extrabold text-white sm:text-5xl">
              {post.title}
            </h1>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          {post.excerpt && (
            <p className="mb-6 text-lg text-muted-foreground">{post.excerpt}</p>
          )}
          <p className="whitespace-pre-line leading-relaxed text-foreground/90">
            {post.content}
          </p>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
