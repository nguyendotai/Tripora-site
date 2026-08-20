import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/features/post/types/post.types";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function authorName(user: Post["user"]) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || "Người dùng Tripora";
}

export function CommunityHighlights({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            <span className="border-b-[3px] border-primary pb-1">
              Cộng đồng
            </span>{" "}
            Tripora
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Travel Story mới nhất từ những người đã đi thật.
          </p>
        </div>
        <Link
          href="/community"
          className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:inline"
        >
          Xem tất cả →
        </Link>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <ScrollReveal key={post.id} delay={(index % 6) * 0.06}>
            <Link
              href="/community"
              className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-transform duration-300 hover:-translate-y-1"
            >
              {post.images[0] && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.images[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  {post.user.avatar ? (
                    <Image
                      src={post.user.avatar}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                      {authorName(post.user).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <p className="text-xs font-medium text-muted-foreground">
                    {authorName(post.user)}
                  </p>
                </div>
                <p className="mt-2.5 line-clamp-2 text-sm text-foreground/90">{post.caption}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" />
                    {post._count?.likes ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post._count?.comments ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
