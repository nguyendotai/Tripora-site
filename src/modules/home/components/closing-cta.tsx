import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

export function ClosingCta() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <ScrollReveal>
        <div
          className="mx-auto flex max-w-7xl flex-col items-center gap-5 rounded-[var(--radius-2xl)] px-6 py-14 text-center sm:py-20"
          style={{ backgroundColor: "#14365C" }}
        >
          <p className="text-2xl font-bold text-white sm:text-4xl">
            Chuyến đi tiếp theo của bạn bắt đầu từ đây
          </p>
          <p className="max-w-lg text-sm text-white/70 sm:text-base">
            Tạo tài khoản miễn phí để lưu điểm đến, viết đánh giá và lên lịch
            trình cho riêng mình.
          </p>
          <Button
            size="lg"
            className="rounded-full bg-white px-8 text-[#14365C] hover:bg-white/90"
            nativeButton={false}
            render={<Link href="/register" />}
          >
            Bắt đầu miễn phí
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
