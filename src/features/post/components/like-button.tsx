"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useLikePostMutation,
  useListMyLikesQuery,
  useUnlikePostMutation,
} from "@/features/like/api/like.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function LikeButton({
  postId,
  likeCount,
  className,
}: {
  postId: string;
  likeCount: number;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { data } = useListMyLikesQuery(undefined, { skip: !accessToken });
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation();

  const isLiked = data?.some((item) => item.postId === postId) ?? false;
  const isLoading = isLiking || isUnliking;

  const handleClick = () => {
    if (!accessToken) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isLiked) {
      unlikePost({ postId });
    } else {
      likePost({ postId });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Bỏ thích bài viết" : "Thích bài viết"}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", isLiked && "fill-current text-red-500")} />
      {likeCount > 0 && <span>{likeCount}</span>}
    </button>
  );
}
