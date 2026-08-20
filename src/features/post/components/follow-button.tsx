"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  useFollowUserMutation,
  useListMyFollowingQuery,
  useUnfollowUserMutation,
} from "@/features/follow/api/follow.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function FollowButton({
  userId,
  className,
}: {
  userId: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const currentUserId = useAppSelector((state) => state.auth.user?.id);

  const { data } = useListMyFollowingQuery(undefined, { skip: !accessToken });
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();

  if (userId === currentUserId) {
    return null;
  }

  const isFollowed = data?.some((item) => item.followingId === userId) ?? false;
  const isLoading = isFollowing || isUnfollowing;

  const handleClick = () => {
    if (!accessToken) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    if (isFollowed) {
      unfollowUser({ followingId: userId });
    } else {
      followUser({ followingId: userId });
    }
  };

  return (
    <Button
      type="button"
      variant={isFollowed ? "outline" : "default"}
      size="sm"
      disabled={isLoading}
      onClick={handleClick}
      className={className}
    >
      {isFollowed ? "Đang theo dõi" : "Theo dõi"}
    </Button>
  );
}
