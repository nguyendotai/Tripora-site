"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-0.5", readOnly && "pointer-events-none")}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          tabIndex={readOnly ? -1 : 0}
          aria-label={`${star} sao`}
          onClick={() => onChange?.(star)}
          className="p-0.5 disabled:cursor-default"
        >
          <Star
            className={cn(
              iconSize,
              star <= value ? "fill-current text-amber-500" : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}
