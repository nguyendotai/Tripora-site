"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useListReviewsQuery,
  useUpdateReviewMutation,
  type ReviewTarget,
} from "../api/review.api";
import { reviewSchema, type ReviewFormValues } from "../schemas/review.schema";
import { StarRating } from "./star-rating";

function reviewerName(review: { user?: { firstName?: string | null; lastName?: string | null } }) {
  const name = [review.user?.firstName, review.user?.lastName].filter(Boolean).join(" ");
  return name || "Người dùng Tripora";
}

function ReviewForm({
  target,
  defaultValues,
  reviewId,
  onDone,
}: {
  target: ReviewTarget;
  defaultValues?: ReviewFormValues;
  reviewId?: string;
  onDone?: () => void;
}) {
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: defaultValues ?? { rating: 0, content: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (values: ReviewFormValues) => {
    setSubmitError(null);
    try {
      if (reviewId) {
        await updateReview({ id: reviewId, target, data: values }).unwrap();
      } else {
        await createReview({ ...target, ...values }).unwrap();
      }
      onDone?.();
    } catch (error) {
      const status = (error as { status?: number })?.status;
      setSubmitError(
        status === 403
          ? "Bạn cần đặt và hoàn tất ít nhất 1 lượt đặt chỗ ở đây trước khi đánh giá."
          : "Không gửi được đánh giá. Vui lòng thử lại.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <StarRating value={rating} onChange={(v) => setValue("rating", v, { shouldValidate: true })} />
        {errors.rating && <p className="mt-1 text-xs text-destructive">{errors.rating.message}</p>}
      </div>
      <Textarea placeholder="Chia sẻ trải nghiệm của bạn..." rows={3} {...register("content")} />
      {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      {submitError && <p className="text-xs text-destructive">{submitError}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} size="sm" className="rounded-full">
          {isLoading ? "Đang lưu..." : reviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
        </Button>
        {reviewId && onDone && (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Huỷ
          </Button>
        )}
      </div>
    </form>
  );
}

export function ReviewSection({ target }: { target: ReviewTarget }) {
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const { data, isLoading } = useListReviewsQuery(target);
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [isEditing, setIsEditing] = useState(false);

  const reviews = data?.items ?? [];
  const ownReview = reviews.find((r) => r.userId === currentUserId);
  const otherReviews = reviews.filter((r) => r.id !== ownReview?.id);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <section className="border-t border-border pt-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Đánh giá</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(averageRating)} readOnly size="sm" />
            <span className="text-sm text-muted-foreground">
              {averageRating.toFixed(1)} ({reviews.length} đánh giá)
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {!accessToken ? (
          <p className="text-sm text-muted-foreground">
            <Link href={`/login?returnTo=${encodeURIComponent(pathname)}`} className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>{" "}
            để viết đánh giá.
          </p>
        ) : ownReview && !isEditing ? (
          <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <StarRating value={ownReview.rating} readOnly size="sm" />
              <span className="text-xs font-medium text-muted-foreground">Đánh giá của bạn</span>
            </div>
            {ownReview.content && <p className="mt-2 text-sm text-foreground/90">{ownReview.content}</p>}
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                onClick={() => deleteReview({ id: ownReview.id, target })}
              >
                Xoá
              </Button>
            </div>
          </div>
        ) : ownReview && isEditing ? (
          <ReviewForm
            target={target}
            reviewId={ownReview.id}
            defaultValues={{ rating: ownReview.rating, content: ownReview.content ?? "" }}
            onDone={() => setIsEditing(false)}
          />
        ) : (
          <ReviewForm target={target} />
        )}
      </div>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải đánh giá...</p>
        ) : otherReviews.length === 0 && !ownReview ? (
          <p className="text-sm text-muted-foreground">Chưa có đánh giá nào.</p>
        ) : (
          otherReviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{reviewerName(review)}</p>
                <StarRating value={review.rating} readOnly size="sm" />
              </div>
              {review.content && <p className="mt-1.5 text-sm text-foreground/80">{review.content}</p>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
