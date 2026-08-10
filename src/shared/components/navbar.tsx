import Link from 'next/link';
import { Search } from 'lucide-react';
import { Logo } from '@/shared/components/logo';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

const NAV_LINKS = [
  { href: '/properties', label: 'Khách sạn' },
  { href: '/products', label: 'Tour & trải nghiệm' },
  { href: '/destinations', label: 'Điểm đến' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Tìm kiếm" className="hidden sm:inline-flex">
            <Search className="size-4.5" />
          </Button>
          <ThemeToggle />
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }), 'hidden sm:inline-flex')}>
            Đăng nhập
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: 'default' }), 'rounded-full')}>
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
