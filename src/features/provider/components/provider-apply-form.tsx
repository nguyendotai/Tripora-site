"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadImageMutation } from "@/features/upload/api/upload.api";
import { useApplyProviderMutation, useGetMyProviderQuery } from "../api/provider.api";
import {
  applyProviderSchema,
  type ApplyProviderFormValues,
} from "../schemas/apply-provider.schema";
import type { Provider, ProviderStatus } from "../types/provider.types";

const TYPE_OPTIONS: { value: ApplyProviderFormValues["type"]; label: string }[] = [
  { value: "HOTEL", label: "Khách sạn / Chỗ nghỉ" },
  { value: "TOUR", label: "Tour du lịch" },
  { value: "ACTIVITY", label: "Trải nghiệm / Hoạt động" },
  { value: "TRANSPORT", label: "Vận chuyển" },
  { value: "FLIGHT", label: "Hãng hàng không" },
];

const STATUS_DISPLAY: Record<
  ProviderStatus,
  { label: string; variant: "default" | "secondary" | "destructive"; description: string }
> = {
  PENDING: {
    label: "Đang chờ duyệt",
    variant: "secondary",
    description:
      "Hồ sơ của bạn đã được gửi và đang chờ Tripora xét duyệt. Chúng tôi sẽ thông báo ngay khi có kết quả.",
  },
  APPROVED: {
    label: "Đã duyệt",
    variant: "default",
    description:
      "Hồ sơ đối tác của bạn đã được duyệt. Đăng nhập vào Tripora Admin (bằng đúng tài khoản này) để bắt đầu quản lý.",
  },
  REJECTED: {
    label: "Bị từ chối",
    variant: "destructive",
    description: "Hồ sơ của bạn đã bị từ chối. Vui lòng liên hệ đội ngũ Tripora để biết thêm chi tiết.",
  },
  SUSPENDED: {
    label: "Đã bị khoá",
    variant: "destructive",
    description: "Hồ sơ đối tác của bạn đang bị khoá. Vui lòng liên hệ đội ngũ Tripora để được hỗ trợ.",
  },
};

function ProviderStatusCard({ provider }: { provider: Provider }) {
  const status = STATUS_DISPLAY[provider.status];
  return (
    <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        {provider.logo ? (
          <Image
            src={provider.logo}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
            {provider.name[0]?.toUpperCase()}
          </span>
        )}
        <div>
          <p className="font-semibold">{provider.name}</p>
          <p className="text-sm text-muted-foreground">
            {TYPE_OPTIONS.find((option) => option.value === provider.type)?.label}
          </p>
        </div>
        <Badge variant={status.variant} className="ml-auto">
          {status.label}
        </Badge>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{status.description}</p>
    </div>
  );
}

function extractErrorMessage(error: unknown): string | null {
  if (error && typeof error === "object" && "data" in error) {
    return (error.data as { message?: string })?.message ?? null;
  }
  return null;
}

export function ProviderApplyForm() {
  const { data: provider, isLoading, error } = useGetMyProviderQuery();
  const [applyProvider, { isLoading: isApplying }] = useApplyProviderMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [logo, setLogo] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyProviderFormValues>({
    resolver: zodResolver(applyProviderSchema),
    defaultValues: { name: "", type: "HOTEL", contact: "", description: "" },
  });

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLogoError(null);
    try {
      const { url } = await uploadImage(file).unwrap();
      setLogo(url);
    } catch {
      setLogoError("Tải ảnh thất bại. Vui lòng thử lại.");
    }
  };

  const onSubmit = async (values: ApplyProviderFormValues) => {
    setSubmitError(null);
    try {
      await applyProvider({
        name: values.name,
        type: values.type,
        contact: values.contact || undefined,
        description: values.description || undefined,
        logo: logo ?? undefined,
      }).unwrap();
    } catch (submitErr) {
      setSubmitError(extractErrorMessage(submitErr) ?? "Gửi hồ sơ thất bại. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return <p className="mt-10 text-sm text-muted-foreground">Đang tải...</p>;
  }

  if (provider) {
    return <ProviderStatusCard provider={provider} />;
  }

  const notAppliedYet = error && typeof error === "object" && "status" in error && error.status === 404;

  if (error && !notAppliedYet) {
    return (
      <p className="mt-10 text-sm text-destructive">
        Không tải được trạng thái hồ sơ đối tác. Vui lòng thử lại sau.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {logo ? (
            <Image
              src={logo}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ShieldCheck className="h-6 w-6" />
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
            <span className="sr-only">Tải logo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleLogoChange}
            disabled={isUploading}
          />
        </div>
        <div>
          <p className="text-sm font-medium">Logo (tuỳ chọn)</p>
          {logoError && <p className="text-xs text-destructive">{logoError}</p>}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Tên doanh nghiệp</Label>
          <Input id="name" placeholder="VD: Khách sạn Biển Xanh" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Loại hình kinh doanh</Label>
          <select
            id="type"
            {...register("type")}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="contact">Thông tin liên hệ (tuỳ chọn)</Label>
        <Input id="contact" placeholder="SĐT hoặc email liên hệ" {...register("contact")} />
        {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="description">Giới thiệu ngắn (tuỳ chọn)</Label>
        <Textarea
          id="description"
          placeholder="Giới thiệu ngắn về doanh nghiệp của bạn"
          {...register("description")}
        />
      </div>

      {submitError && <p className="mt-4 text-sm text-destructive">{submitError}</p>}

      <Button type="submit" disabled={isApplying} className="mt-6 w-full rounded-full sm:w-auto">
        {isApplying ? "Đang gửi hồ sơ..." : "Gửi hồ sơ đăng ký"}
      </Button>
    </form>
  );
}
