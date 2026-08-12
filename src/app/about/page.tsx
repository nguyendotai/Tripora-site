import { Compass, Heart, MapPinned } from "lucide-react";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { ScrollReveal } from "@/shared/components/scroll-reveal";

const VALUES = [
  {
    icon: Compass,
    title: "Khám phá đúng gu",
    description:
      "Gợi ý điểm đến và cẩm nang được chọn lọc, không phải danh sách quảng cáo trả tiền.",
  },
  {
    icon: MapPinned,
    title: "Lên kế hoạch dễ dàng",
    description:
      "Từ tìm điểm đến tới lập lịch trình theo ngày, mọi thứ gói gọn trong một nơi.",
  },
  {
    icon: Heart,
    title: "Cộng đồng thật",
    description:
      "Đánh giá và wishlist đến từ người dùng thật, giúp bạn quyết định tự tin hơn.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Về Tripora
            </p>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Đồng hành cùng bạn từ ý tưởng đến chuyến đi
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Tripora là nền tảng khám phá điểm đến và lập lịch trình du lịch,
              giúp việc lên kế hoạch cho một chuyến đi trở nên đơn giản và
              đáng tin cậy hơn.
            </p>
          </ScrollReveal>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {VALUES.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} delay={index * 0.1}>
                <div className="flex h-full flex-col items-start gap-4 rounded-[var(--radius-lg)] bg-secondary p-6">
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
        </div>
      </main>
      <Footer />
    </>
  );
}
