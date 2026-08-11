"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/features/auth/api/auth.api";
import { clearSession } from "@/features/auth/services/auth-storage";
import { logout } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function AuthNavActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // ignore — clear local session regardless
    }
    clearSession();
    dispatch(logout());
    router.push("/");
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="rounded-full pl-1.5 pr-3" />}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {(user.firstName ?? user.email)[0]?.toUpperCase()}
          </span>
          <span className="ml-2 text-sm font-medium">{user.firstName ?? user.email}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="hidden rounded-full sm:inline-flex"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        Đăng nhập
      </Button>
      <Button className="rounded-full" nativeButton={false} render={<Link href="/register" />}>
        Bắt đầu
      </Button>
    </>
  );
}
