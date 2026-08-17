"use client";

import { ProviderApplyForm } from "@/features/provider/components/provider-apply-form";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

function BecomePartnerContent() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Trở thành đối tác Tripora</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Đăng ký kinh doanh khách sạn, tour, trải nghiệm, vận chuyển hoặc hàng không trên Tripora.
          Sau khi được duyệt, bạn quản lý toàn bộ hoạt động kinh doanh qua Tripora Admin.
        </p>
        <ProviderApplyForm />
      </div>
    </main>
  );
}

export default function BecomePartnerPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <BecomePartnerContent />
      </RequireAuth>
      <Footer />
    </>
  );
}
