"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useListCommentsQuery,
} from "@/features/comment/api/comment.api";
import { commentSchema, type CommentFormValues } from "@/features/comment/schemas/comment.schema";
import type { Comment } from "@/features/comment/types/comment.types";

function commenterName(user: Comment["user"]) {
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

function CommentItem({ postId, comment }: { postId: string; comment: Comment }) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const canDelete = currentUser?.id === comment.userId || currentUser?.role === "ADMIN";

  return (
    <div className="flex items-start gap-2.5">
      {comment.user.avatar ? (
        <Image
          src={comment.user.avatar}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          {commenterName(comment.user).charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="rounded-[var(--radius-md)] bg-secondary px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold leading-tight">{commenterName(comment.user)}</p>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="mt-0.5 text-sm whitespace-pre-line text-foreground/90">{comment.content}</p>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={() => deleteComment({ id: comment.id, postId })}
            disabled={isDeleting}
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive disabled:opacity-60"
          >
            <Trash2 className="h-3 w-3" />
            Xoá
          </button>
        )}
      </div>
    </div>
  );
}

function CommentForm({ postId }: { postId: string }) {
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (values: CommentFormValues) => {
    await createComment({ postId, content: values.content }).unwrap();
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2">
      <div className="flex-1">
        <Textarea
          placeholder="Viết bình luận..."
          rows={1}
          className="min-h-9 resize-none py-2"
          {...register("content")}
        />
        {errors.content && <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
      </div>
      <Button type="submit" size="sm" className="rounded-full" disabled={isLoading}>
        Gửi
      </Button>
    </form>
  );
}

export function CommentSection({ postId, commentCount }: { postId: string; commentCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useListCommentsQuery({ postId }, { skip: !isOpen });

  const handleToggle = () => {
    if (!accessToken && !isOpen) {
      // Xem binh luan khong bat buoc dang nhap — chi mo rong danh sach, chua can chuyen huong.
      setIsOpen(true);
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
        )}
      >
        <MessageCircle className="h-4 w-4" />
        {commentCount > 0 && <span>{commentCount}</span>}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải bình luận...</p>
          ) : data && data.items.length > 0 ? (
            data.items.map((comment) => (
              <CommentItem key={comment.id} postId={postId} comment={comment} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>
          )}

          {accessToken ? (
            <CommentForm postId={postId} />
          ) : (
            <p className="text-sm text-muted-foreground">
              <button
                type="button"
                onClick={() => router.push(`/login?returnTo=${encodeURIComponent(pathname)}`)}
                className="font-medium text-primary hover:underline"
              >
                Đăng nhập
              </button>{" "}
              để bình luận.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
