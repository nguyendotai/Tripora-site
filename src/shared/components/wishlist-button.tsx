"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useAddToWishlistMutation,
  useListWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/features/wishlist/api/wishlist.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function WishlistButton({
  destinationId,
  className,
}: {
  destinationId: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { data } = useListWishlistQuery(undefined, { skip: !accessToken });
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  const isWishlisted = data?.some((item) => item.destinationId === destinationId) ?? false;
  const isLoading = isAdding || isRemoving;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!accessToken) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isWishlisted) {
      removeFromWishlist({ destinationId });
    } else {
      addToWishlist({ destinationId });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "Bỏ khỏi mục yêu thích" : "Thêm vào mục yêu thích"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60 disabled:opacity-60",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", isWishlisted && "fill-current text-red-500")} />
    </button>
  );
}
