import Link from "next/link";
import { Logo } from "./logo";

const FOOTER_COLUMNS = [
  {
    title: "Khám phá",
    links: [
      { href: "/destinations", label: "Điểm đến" },
      { href: "/guides", label: "Cẩm nang du lịch" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Tài khoản",
    links: [
      { href: "/trips", label: "Lịch trình của tôi" },
      { href: "/wishlist", label: "Đã lưu" },
      { href: "/login", label: "Đăng nhập" },
    ],
  },
  {
    title: "Về Tripora",
    links: [
      { href: "/about", label: "Giới thiệu" },
      { href: "/contact", label: "Liên hệ" },
      { href: "/become-partner", label: "Trở thành đối tác" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Nền tảng khám phá điểm đến và lập lịch trình du lịch.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tripora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
