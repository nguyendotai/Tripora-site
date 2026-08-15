"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSession } from "@/features/auth/services/auth-storage";
import { setCredentials } from "@/features/auth/store/auth.slice";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { useUploadImageMutation } from "@/features/upload/api/upload.api";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { useGetMeQuery, useUpdateMeMutation } from "../api/user.api";
import { profileSchema, type ProfileFormValues } from "../schemas/profile.schema";

const ROLE_LABELS: Record<string, string> = {
  USER: "Khách hàng",
  ADMIN: "Quản trị viên",
};

function formatJoinDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ProfileForm() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const cachedUser = useAppSelector((state) => state.auth.user);
  const { data: user, isLoading, isError } = useGetMeQuery();
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = user ?? cachedUser;

  const applyUpdatedUser = (updated: AuthUser) => {
    if (accessToken) {
      dispatch(setCredentials({ accessToken, user: updated }));
      saveSession(accessToken, updated);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarError(null);
    try {
      const { url } = await uploadImage(file).unwrap();
      const updated = await updateMe({ avatar: url }).unwrap();
      applyUpdatedUser(updated);
    } catch {
      setAvatarError("Tải ảnh đại diện thất bại. Vui lòng thử lại.");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { firstName: profile.firstName ?? "", lastName: profile.lastName ?? "" }
      : undefined,
  });

  useEffect(() => {
    if (saved) {
      const timeout = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [saved]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaved(false);
    const updated = await updateMe(values).unwrap();
    applyUpdatedUser(updated);
    reset(values);
    setSaved(true);
  };

  if (isLoading && !profile) {
    return <p className="mt-10 text-sm text-muted-foreground">Đang tải...</p>;
  }

  if (isError && !profile) {
    return <p className="mt-10 text-sm text-destructive">Không tải được thông tin hồ sơ.</p>;
  }

  if (!profile) return null;

  const initial = (profile.firstName ?? profile.email)[0]?.toUpperCase();

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-6 text-center lg:items-start lg:text-left">
        <div className="relative">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
              {initial}
            </span>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-primary disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
            <span className="sr-only">Đổi ảnh đại diện</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
        </div>
        {avatarError && <p className="text-xs text-destructive">{avatarError}</p>}
        <div>
          <p className="font-semibold">
            {profile.firstName || profile.lastName
              ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
              : profile.email}
          </p>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
        <dl className="mt-2 w-full space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Vai trò</dt>
            <dd className="font-medium">{ROLE_LABELS[profile.role] ?? profile.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Thành viên từ</dt>
            <dd className="font-medium">{formatJoinDate(profile.createdAt)}</dd>
          </div>
        </dl>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[var(--radius-lg)] border border-border bg-card p-6"
      >
        <h2 className="font-semibold">Thông tin cá nhân</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cập nhật họ tên hiển thị của bạn. Email không thể thay đổi.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Tên</Label>
            <Input id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Họ</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5 mt-4">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} disabled />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" disabled={isSaving || !isDirty} className="rounded-full">
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-primary">
              <CheckCircle2 className="h-4 w-4" /> Đã lưu
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
