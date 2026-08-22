"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStartConversationMutation } from "@/features/conversation/api/conversation.api";
import {
  messageSchema,
  type MessageFormValues,
} from "@/features/conversation/schemas/conversation.schema";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function extractErrorMessage(error: unknown): string | null {
  if (error && typeof error === "object" && "data" in error) {
    return (error.data as { message?: string })?.message ?? null;
  }
  return null;
}

function NewConversationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("providerId");
  const providerName = searchParams.get("providerName") ?? "đối tác";
  const [startConversation, { isLoading }] = useStartConversationMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  if (!providerId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Thiếu thông tin đối tác. Vui lòng quay lại trang sản phẩm và bấm &quot;Liên hệ đối
          tác&quot;.
        </p>
      </div>
    );
  }

  const onSubmit = async (values: MessageFormValues) => {
    setSubmitError(null);
    try {
      const conversation = await startConversation({
        providerId,
        message: values.content,
      }).unwrap();
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      setSubmitError(extractErrorMessage(error) ?? "Gửi tin nhắn thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/messages"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Tin nhắn
        </Link>

        <h1 className="text-2xl font-bold">Liên hệ {providerName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-5"
        >
          <Textarea
            placeholder={`Xin chào ${providerName}, tôi muốn hỏi về...`}
            rows={5}
            {...register("content")}
          />
          {errors.content && (
            <p className="mt-1 text-xs text-destructive">{errors.content.message}</p>
          )}
          {submitError && <p className="mt-2 text-xs text-destructive">{submitError}</p>}

          <Button type="submit" className="mt-4 rounded-full" disabled={isLoading}>
            {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function NewConversationPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <Suspense fallback={null}>
          <NewConversationForm />
        </Suspense>
      </RequireAuth>
      <Footer />
    </>
  );
}
