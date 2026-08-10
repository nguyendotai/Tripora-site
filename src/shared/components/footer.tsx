import Link from 'next/link';
import { Logo } from '@/shared/components/logo';

const FOOTER_COLUMNS = [
  {
    title: 'Khám phá',
    links: [
      { href: '/destinations', label: 'Điểm đến' },
      { href: '/properties', label: 'Khách sạn & chỗ ở' },
      { href: '/products', label: 'Tour & trải nghiệm' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { href: '/about', label: 'Về Tripora' },
      { href: '/partners', label: 'Trở thành đối tác' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { href: '/help', label: 'Trung tâm trợ giúp' },
      { href: '/contact', label: 'Liên hệ' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-[32ch] text-sm text-muted-foreground">
            Nền tảng đặt khách sạn và tour du lịch, kết nối bạn với các đối tác đã được xác minh.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground">{column.title}</span>
            {column.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Tripora. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
}
