import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthNavActions } from "./auth-nav-actions";
import { Logo } from "./logo";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/destinations", label: "Điểm đến" },
  { href: "/hotels", label: "Khách sạn" },
  { href: "/tours", label: "Tour" },
  { href: "/guides", label: "Cẩm nang" },
  { href: "/blog", label: "Blog" },
  { href: "/trips", label: "Lịch trình của tôi" },
  { href: "/wishlist", label: "Yêu thích" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            nativeButton={false}
            render={<Link href="/search" />}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Tìm kiếm</span>
          </Button>
          <NotificationBell />
          <ThemeToggle />
          <AuthNavActions />
        </div>
      </div>
    </header>
  );
}
