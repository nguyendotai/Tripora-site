import { BadgePercent } from "lucide-react";
import type { Promotion } from "@/features/promotion/types/promotion.types";
import { formatPrice } from "@/shared/utils/format-price";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

function discountLabel(promotion: Promotion) {
  if (promotion.discountType === "PERCENT") {
    const cap = promotion.maxDiscountAmount
      ? ` (tối đa ${formatPrice(promotion.maxDiscountAmount)})`
      : "";
    return `Giảm ${Number(promotion.discountValue)}%${cap}`;
  }
  return `Giảm ${formatPrice(promotion.discountValue)}`;
}

function formatUntil(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ActivePromotions({ promotions }: { promotions: Promotion[] }) {
  if (promotions.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <ScrollReveal className="mb-8">
        <h2 className="text-2xl font-bold sm:text-3xl">
          <span className="border-b-[3px] border-primary pb-1">Ưu đãi</span>{" "}
          nổi bật
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Mã giảm giá tự động áp dụng lúc thanh toán, không cần nhập mã.
        </p>
      </ScrollReveal>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {promotions.map((promotion, index) => (
          <ScrollReveal key={promotion.id} delay={index * 0.06}>
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-secondary p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <BadgePercent className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{promotion.name}</p>
                <p className="mt-1 text-sm font-bold text-primary">{discountLabel(promotion)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Đến hết {formatUntil(promotion.validUntil)}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
