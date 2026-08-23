"use client";

import { useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";

/**
 * Thay `<form method="GET">` native (hard navigation, remount RootLayout -> phat lai IntroSplash)
 * bang client-side navigation qua router.push() — giu nguyen hanh vi "submit ra URL co query
 * string" nhung khong reload trang. Cac field con (Input/select co san name/defaultValue) khong
 * doi gi.
 */
export function GetSearchForm({
  action,
  className,
  children,
  onSubmitExtra,
}: {
  action: string;
  className?: string;
  children: ReactNode;
  onSubmitExtra?: (formData: FormData) => void;
}) {
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmitExtra?.(formData);

    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value.trim()) {
        params.set(key, value);
      }
    }

    const qs = params.toString();
    router.push(qs ? `${action}?${qs}` : action);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
