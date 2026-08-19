"use client";

import { BookOpen, Building2, Car, Compass, MapPin, Newspaper, Plane, Search, Ticket, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthNavActions } from "./auth-nav-actions";
import { Logo } from "./logo";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

const CATEGORY_LINKS = [
  { href: "/destinations", label: "Điểm đến", icon: MapPin },
  { href: "/hotels", label: "Khách sạn", icon: Building2 },
  { href: "/tours", label: "Tour", icon: Compass },
  { href: "/experiences", label: "Trải nghiệm", icon: Ticket },
  { href: "/transport", label: "Vận chuyển", icon: Car },
  { href: "/flights", label: "Chuyến bay", icon: Plane },
  { href: "/guides", label: "Cẩm nang", icon: BookOpen },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/community", label: "Cộng đồng", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Logo />

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
            <Link
              href="/contact"
              className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-primary sm:block"
            >
              Liên hệ
            </Link>
            <NotificationBell />
            <ThemeToggle />
            <AuthNavActions />
          </div>
        </div>
      </div>

      <div className="hidden border-b border-border bg-muted/40 md:block">
        <nav className="mx-auto flex h-12 max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {CATEGORY_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-primary shadow-sm"
                    : "text-foreground/70 hover:bg-background/60 hover:text-primary",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
