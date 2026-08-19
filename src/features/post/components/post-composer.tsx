"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useListDestinationsQuery } from "@/features/destination/api/destination.api";
import { useUploadImageMutation } from "@/features/upload/api/upload.api";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { useCreatePostMutation } from "../api/post.api";
import { postSchema, type PostFormValues } from "../schemas/post.schema";

function extractErrorMessage(error: unknown): string | null {
  if (error && typeof error === "object" && "data" in error) {
    return (error.data as { message?: string })?.message ?? null;
  }
  return null;
}

export function PostComposer() {
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { data: destinations } = useListDestinationsQuery(
    { limit: 100 },
    { skip: !accessToken },
  );
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { caption: "", destinationId: "" },
  });

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setImageError(null);
    const remaining = 10 - images.length;
    if (remaining <= 0) {
      setImageError("Tối đa 10 ảnh mỗi bài viết.");
      return;
    }

    try {
      const uploaded = await Promise.all(
        files.slice(0, remaining).map((file) => uploadImage(file).unwrap()),
      );
      setImages((prev) => [...prev, ...uploaded.map((u) => u.url)]);
    } catch {
      setImageError("Tải ảnh thất bại. Vui lòng thử lại.");
    }
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const onSubmit = async (values: PostFormValues) => {
    setSubmitError(null);
    if (images.length === 0) {
      setImageError("Thêm ít nhất 1 ảnh cho bài viết.");
      return;
    }

    try {
      await createPost({
        caption: values.caption,
        images,
        destinationId: values.destinationId || undefined,
      }).unwrap();
      reset({ caption: "", destinationId: "" });
      setImages([]);
    } catch (error) {
      setSubmitError(extractErrorMessage(error) ?? "Đăng bài thất bại. Vui lòng thử lại.");
    }
  };

  if (!accessToken) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5 text-sm text-muted-foreground">
        <Link
          href={`/login?returnTo=${encodeURIComponent(pathname)}`}
          className="font-medium text-primary hover:underline"
        >
          Đăng nhập
        </Link>{" "}
        để chia sẻ hành trình của bạn với cộng đồng Tripora.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[var(--radius-lg)] border border-border bg-card p-5"
    >
      <Label htmlFor="caption" className="sr-only">
        Chia sẻ hành trình
      </Label>
      <Textarea
        id="caption"
        placeholder="Chuyến đi của bạn thế nào? Chia sẻ khoảnh khắc đáng nhớ..."
        rows={3}
        {...register("caption")}
      />
      {errors.caption && <p className="mt-1 text-xs text-destructive">{errors.caption.message}</p>}

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((url) => (
            <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-[var(--radius-md)]">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Xoá ảnh</span>
              </button>
            </div>
          ))}
        </div>
      )}
      {imageError && <p className="mt-1.5 text-xs text-destructive">{imageError}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="mr-1.5 h-4 w-4" />
          )}
          Thêm ảnh
        </Button>

        <select
          {...register("destinationId")}
          className="h-9 rounded-full border border-input bg-transparent px-3 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <option value="">Gắn địa điểm (tuỳ chọn)</option>
          {destinations?.items.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.name}
            </option>
          ))}
        </select>

        <Button
          type="submit"
          size="sm"
          className="ml-auto rounded-full"
          disabled={isCreating || isUploading}
        >
          {isCreating ? "Đang đăng..." : "Đăng bài"}
        </Button>
      </div>
      {submitError && <p className="mt-2 text-xs text-destructive">{submitError}</p>}
    </form>
  );
}
