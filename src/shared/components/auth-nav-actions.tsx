'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useAppDispatch } from '@/shared/hooks/use-app-dispatch';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useIsClient } from '@/shared/hooks/use-is-client';
import { useLogoutMutation, clearCredentials, clearAuthStorage } from '@/features/auth';

export function AuthNavActions() {
  const isClient = useIsClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // best-effort — vẫn đăng xuất phía client dù API lỗi
    }
    dispatch(clearCredentials());
    clearAuthStorage();
    router.push('/');
  };

  if (!isClient) {
    return <div className="h-9 w-40" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/account"
          className="hidden items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary sm:flex"
        >
          <User className="size-4" />
          {user.email}
        </Link>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }), 'hidden sm:inline-flex')}>
        Đăng nhập
      </Link>
      <Link href="/register" className={cn(buttonVariants({ variant: 'default' }), 'rounded-full')}>
        Đăng ký
      </Link>
    </>
  );
}
