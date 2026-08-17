"use client";

import { CalendarCheck, Heart, LogOut, Map, Receipt, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {(user.firstName ?? user.email)[0]?.toUpperCase()}
            </span>
          )}
          <span className="ml-2 text-sm font-medium">{user.firstName ?? user.email}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 p-1.5">
          <DropdownMenuItem
            className="gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5"
            render={<Link href="/profile" />}
          >
            <UserRound className="size-4" />
            Hồ sơ của tôi
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5"
            render={<Link href="/my-bookings" />}
          >
            <CalendarCheck className="size-4" />
            Đặt chỗ của tôi
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5"
            render={<Link href="/trips" />}
          >
            <Map className="size-4" />
            Lịch trình của tôi
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5"
            render={<Link href="/wishlist" />}
          >
            <Heart className="size-4" />
            Yêu thích
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5"
            render={<Link href="/transactions" />}
          >
            <Receipt className="size-4" />
            Lịch sử giao dịch
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem
            variant="destructive"
            className="gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2.5"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Đăng xuất
          </DropdownMenuItem>
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
