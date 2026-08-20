import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/features/review/components/star-rating";
import type { ReviewHighlight } from "@/features/review/types/review.types";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function reviewerName(user: ReviewHighlight["user"]) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || "Người dùng Tripora";
}

function reviewedTarget(review: ReviewHighlight) {
  if (review.property) {
    return { label: review.property.name, href: `/hotels/${review.property.slug}` };
  }
  if (review.destination) {
    return { label: review.destination.name, href: `/destinations/${review.destination.slug}` };
  }
  return null;
}

export function ReviewHighlights({ reviews }: { reviews: ReviewHighlight[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">
          <span className="border-b-[3px] border-primary pb-1">
            Đánh giá
          </span>{" "}
          từ khách hàng
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Trải nghiệm thật từ những người đã từng đặt chỗ qua Tripora.
        </p>
      </ScrollReveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => {
          const target = reviewedTarget(review);
          return (
            <ScrollReveal key={review.id} delay={(index % 6) * 0.06}>
              <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-card p-5">
                <StarRating value={review.rating} readOnly size="sm" />
                <p className="mt-3 flex-1 text-sm text-foreground/90">
                  &quot;{review.content}&quot;
                </p>
                <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
                  {review.user.avatar ? (
                    <Image
                      src={review.user.avatar}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {reviewerName(review.user).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">
                      {reviewerName(review.user)}
                    </p>
                    {target && (
                      <Link
                        href={target.href}
                        className="line-clamp-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                      >
                        {target.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
