"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { loadSession } from "@/features/auth/services/auth-storage";
import { setCredentials } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";

export function RequireAuth({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      const session = loadSession();
      if (session) {
        dispatch(setCredentials(session));
      }
    }
    setChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (checked && !accessToken) {
      router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`);
    }
  }, [checked, accessToken, router, pathname]);

  if (!checked || !accessToken) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return <>{children}</>;
}
