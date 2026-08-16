"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useRetryPaymentMutation } from "@/features/payment/api/payment.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [retryPayment, { isLoading }] = useRetryPaymentMutation();

  const handleRetry = async () => {
    if (!paymentId) return;
    const result = await retryPayment(paymentId).unwrap();
    window.location.assign(result.checkoutUrl);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <XCircle className="mx-auto h-14 w-14 text-muted-foreground" />
      <h1 className="mt-4 text-2xl font-bold">Đã huỷ thanh toán</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Đơn đặt chỗ của bạn vẫn đang được giữ chỗ tạm thời — hoàn tất thanh toán trước khi hết hạn
        giữ chỗ, nếu không hệ thống sẽ tự huỷ và trả lại chỗ.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {paymentId && (
          <Button disabled={isLoading} onClick={handleRetry} className="rounded-full">
            {isLoading ? "Đang tạo lại phiên thanh toán..." : "Thử thanh toán lại"}
          </Button>
        )}
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/" />}
          className="rounded-full"
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <CheckoutCancelContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
