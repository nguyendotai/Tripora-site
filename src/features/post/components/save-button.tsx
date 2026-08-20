"use client";

import { Bookmark } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useListMySavedPostsQuery,
  useSavePostMutation,
  useUnsavePostMutation,
} from "@/features/saved-post/api/saved-post.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function SaveButton({ postId, className }: { postId: string; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { data } = useListMySavedPostsQuery(undefined, { skip: !accessToken });
  const [savePost, { isLoading: isSaving }] = useSavePostMutation();
  const [unsavePost, { isLoading: isUnsaving }] = useUnsavePostMutation();

  const isSaved = data?.some((item) => item.postId === postId) ?? false;
  const isLoading = isSaving || isUnsaving;

  const handleClick = () => {
    if (!accessToken) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isSaved) {
      unsavePost({ postId });
    } else {
      savePost({ postId });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết"}
      className={cn(
        "inline-flex items-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60",
        className,
      )}
    >
      <Bookmark className={cn("h-4 w-4", isSaved && "fill-current text-primary")} />
    </button>
  );
}
