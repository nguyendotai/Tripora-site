"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useGetPaymentQuery, useRetryPaymentMutation } from "@/features/payment/api/payment.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";

const DOMAIN_LABELS: Record<string, string> = {
  HOTEL: "Đặt phòng khách sạn",
  TOUR: "Đặt tour",
  EXPERIENCE: "Đặt trải nghiệm",
  TRANSPORT: "Đặt xe",
  FLIGHT: "Đặt vé máy bay",
};

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const { data: payment, isFetching } = useGetPaymentQuery(paymentId ?? "", {
    skip: !paymentId,
    pollingInterval: 2000,
  });
  const [retryPayment, { isLoading: isRetrying }] = useRetryPaymentMutation();

  const handleRetry = async () => {
    if (!paymentId) return;
    const result = await retryPayment(paymentId).unwrap();
    window.location.assign(result.checkoutUrl);
  };

  if (!paymentId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-destructive">Thiếu thông tin giao dịch.</p>
      </div>
    );
  }

  if (!payment || (payment.status === "PENDING" && isFetching)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Đang xử lý thanh toán...</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vui lòng chờ trong giây lát, đừng đóng trang này.
        </p>
      </div>
    );
  }

  if (payment.status === "SUCCESS") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Thanh toán thành công</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {DOMAIN_LABELS[payment.bookingDomain] ?? "Đơn đặt chỗ"} #{payment.bookingId} của bạn đã
          được xác nhận.
        </p>

        <div className="mt-8 space-y-3 rounded-[var(--radius-lg)] border border-border bg-card p-6 text-left">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Loại đặt chỗ</span>
            <span className="text-sm font-medium">
              {DOMAIN_LABELS[payment.bookingDomain] ?? payment.bookingDomain}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Số tiền đã thanh toán</span>
            <span className="text-base font-bold text-primary">
              {formatPrice(payment.amount, payment.currency)}
            </span>
          </div>
        </div>

        <Button nativeButton={false} render={<Link href="/" />} className="mt-8 rounded-full">
          Về trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <XCircle className="mx-auto h-14 w-14 text-destructive" />
      <h1 className="mt-4 text-2xl font-bold">Thanh toán thất bại</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Đơn đặt chỗ #{payment.bookingId} vẫn đang được giữ chỗ tạm thời, thử thanh toán lại trước
        khi hết hạn giữ chỗ.
      </p>

      <Button disabled={isRetrying} onClick={handleRetry} className="mt-8 rounded-full">
        {isRetrying ? "Đang tạo lại phiên thanh toán..." : "Thử thanh toán lại"}
      </Button>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
