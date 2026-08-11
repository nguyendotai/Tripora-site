import { Heart, MapPinned, Star } from "lucide-react";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const VALUE_PROPS = [
  {
    icon: MapPinned,
    title: "Lập lịch trình theo ngày",
    description:
      "Thêm địa điểm, sắp xếp theo từng ngày và giữ mọi kế hoạch ở một nơi duy nhất.",
  },
  {
    icon: Star,
    title: "Đánh giá thật từ cộng đồng",
    description:
      "Review và xếp hạng đến từ những người đã thật sự ghé thăm, không quảng cáo.",
  },
  {
    icon: Heart,
    title: "Lưu điểm đến yêu thích",
    description:
      "Wishlist giúp bạn giữ lại những nơi muốn đến để lên kế hoạch sau này.",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {VALUE_PROPS.map(({ icon: Icon, title, description }, index) => (
          <ScrollReveal key={title} delay={index * 0.1}>
            <div className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-secondary p-5 transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
