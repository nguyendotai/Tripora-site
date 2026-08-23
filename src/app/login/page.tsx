"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/features/auth/api/auth.api";
import { AuthBrandPanel } from "@/features/auth/components/auth-brand-panel";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";
import { saveSession } from "@/features/auth/services/auth-storage";
import { setCredentials } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { Logo } from "@/shared/components/logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      saveSession(result.accessToken, result.user);
      router.push(searchParams.get("returnTo") ?? "/");
    } catch {
      // Sai email/mật khẩu — `error` từ useLoginMutation đã tự hiện thông báo bên dưới.
    }
  };

  const returnTo = searchParams.get("returnTo") ?? "/";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-card p-10 shadow-sm"
    >
      <div className="flex justify-center lg:hidden">
        <Logo />
      </div>

      <h1 className="mt-6 text-center text-3xl font-bold lg:mt-0 lg:text-left">
        Đăng nhập
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground lg:text-left">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </p>

      <div className="mt-6">
        <GoogleSignInButton text="signin_with" redirectTo={returnTo} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">Hoặc</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-11"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">Email hoặc mật khẩu không đúng.</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-full text-base"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel />
      <div className="flex items-center justify-center bg-muted px-4 py-10 lg:bg-background">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
