"use client";

import { MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { useDeletePostMutation } from "../api/post.api";
import type { Post } from "../types/post.types";
import { FollowButton } from "./follow-button";
import { LikeButton } from "./like-button";
import { SaveButton } from "./save-button";

function authorName(user: Post["user"]) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || "Người dùng Tripora";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const isOwner = post.userId === currentUserId;
  const extraImages = post.images.length - 1;

  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      {post.images[0] && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.images[0]}
            alt=""
            fill
            sizes="(min-width: 1024px) 700px, 100vw"
            className="object-cover"
          />
          {extraImages > 0 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              +{extraImages} ảnh
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {post.user.avatar ? (
              <Image
                src={post.user.avatar}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {authorName(post.user).charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold leading-tight">{authorName(post.user)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
                {!!post.user._count?.followers && (
                  <> · {post.user._count.followers} người theo dõi</>
                )}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <FollowButton userId={post.userId} className="rounded-full" />
            {isOwner && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                disabled={isDeleting}
                onClick={() => deletePost(post.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Xoá bài viết</span>
              </Button>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm whitespace-pre-line text-foreground/90">{post.caption}</p>

        {post.destination && (
          <Link
            href={`/destinations/${post.destination.slug}`}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground hover:underline"
          >
            <MapPin className="h-3 w-3" />
            {post.destination.name}
          </Link>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <LikeButton postId={post.id} likeCount={post._count?.likes ?? 0} />
          <SaveButton postId={post.id} />
        </div>
      </div>
    </article>
  );
}
