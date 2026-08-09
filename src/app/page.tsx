import { ThemeToggle } from "@/shared/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-lg font-bold text-primary">Tripora</span>
        <ThemeToggle />
      </header>
      <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Đặt <span className="text-primary">chuyến đi</span> tiếp theo của bạn
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Tripora — nền tảng đặt Property, Tour/Activity theo mô hình Marketplace.
          Frontend đang trong giai đoạn khởi tạo dự án.
        </p>
      </section>
    </main>
  );
}
