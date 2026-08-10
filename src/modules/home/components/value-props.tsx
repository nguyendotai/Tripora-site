import { BadgeCheck, CalendarClock, LifeBuoy, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '@/shared/components/scroll-reveal';

const PROPS = [
  {
    icon: ShieldCheck,
    title: 'Đặt chỗ minh bạch',
    body: 'Giá hiển thị đầy đủ, không phụ phí ẩn khi thanh toán.',
    wide: true,
  },
  {
    icon: BadgeCheck,
    title: 'Đối tác được xác minh',
    body: 'Khách sạn và đơn vị tổ chức tour đều qua duyệt trước khi lên sàn.',
  },
  {
    icon: CalendarClock,
    title: 'Huỷ linh hoạt',
    body: 'Chính sách huỷ rõ ràng theo từng chỗ ở, xem trước khi đặt.',
  },
  {
    icon: LifeBuoy,
    title: 'Hỗ trợ xuyên suốt chuyến đi',
    body: 'Đội ngũ hỗ trợ sẵn sàng khi có sự cố phát sinh trước và trong chuyến đi.',
    wide: true,
  },
];

export function ValueProps() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <ScrollReveal>
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl">Vì sao chọn Tripora</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROPS.map((item, index) => (
            <ScrollReveal
              key={item.title}
              delay={index * 0.08}
              className={item.wide ? 'sm:col-span-2' : undefined}
            >
              <div
                className={`flex h-full items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 ${
                  item.wide ? 'sm:flex-row sm:items-center' : 'flex-col'
                }`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent text-accent-foreground">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
