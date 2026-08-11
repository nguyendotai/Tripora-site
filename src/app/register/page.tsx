"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/features/auth/api/auth.api";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/register.schema";
import { saveSession } from "@/features/auth/services/auth-storage";
import { setCredentials } from "@/features/auth/store/auth.slice";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { Logo } from "@/shared/components/logo";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUser(values).unwrap();
    dispatch(setCredentials(result));
    saveSession(result.accessToken, result.user);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <h1 className="mt-6 text-center text-xl font-bold">Tạo tài khoản</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Tên</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Họ</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">
              Không thể tạo tài khoản. Email có thể đã được sử dụng.
            </p>
          )}

          <Button type="submit" disabled={isLoading} className="w-full rounded-full">
            {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </Button>
        </form>
      </div>
    </div>
  );
}
