"use client";

import { ProfileForm } from "@/features/user/components/profile-form";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function ProfileContent() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Hồ sơ của tôi</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý thông tin tài khoản Tripora của bạn.
        </p>
        <ProfileForm />
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <ProfileContent />
      </RequireAuth>
      <Footer />
    </>
  );
}
