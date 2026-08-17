"use client";

import { Loader2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListMyPaymentsQuery } from "../api/payment.api";
import type { Payment, PaymentStatus } from "../types/payment.types";

const DOMAIN_LABELS: Record<string, string> = {
  HOTEL: "Đặt phòng khách sạn",
  TOUR: "Đặt tour",
  EXPERIENCE: "Đặt trải nghiệm",
  TRANSPORT: "Đặt xe",
  FLIGHT: "Đặt vé máy bay",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  SUCCESS: { label: "Thanh toán thành công", variant: "default" },
  PENDING: { label: "Đang chờ thanh toán", variant: "secondary" },
  FAILED: { label: "Thanh toán thất bại", variant: "destructive" },
};

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PaymentCard({ payment }: { payment: Payment }) {
  const status = PAYMENT_STATUS_LABELS[payment.status];

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            {DOMAIN_LABELS[payment.bookingDomain] ?? payment.bookingDomain} #{payment.bookingId}
          </p>
          <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Số tiền</p>
          <p className="text-sm font-bold text-primary">
            {formatPrice(payment.amount, payment.currency)}
          </p>
        </div>
        {Number(payment.discountAmount) > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">Đã giảm</p>
            <p className="text-sm font-medium text-accent-foreground">
              -{formatPrice(payment.discountAmount, payment.currency)}
            </p>
          </div>
        )}
        {payment.invoice && (
          <div>
            <p className="text-xs text-muted-foreground">Số hoá đơn</p>
            <p className="text-sm font-medium">{payment.invoice.invoiceNumber}</p>
          </div>
        )}
      </div>

      {payment.refund && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">Hoàn tiền</p>
          <p className="text-sm font-medium">
            {payment.refund.status === "SUCCESS"
              ? `Đã hoàn ${formatPrice(payment.refund.amount, payment.currency)} (${payment.refund.percent}%)`
              : payment.refund.status === "PENDING"
                ? `Đang xử lý hoàn ${formatPrice(payment.refund.amount, payment.currency)} (${payment.refund.percent}%)`
                : "Hoàn tiền thất bại — vui lòng liên hệ hỗ trợ"}
          </p>
        </div>
      )}
    </div>
  );
}

export function TransactionsList() {
  const { data, isLoading, isError } = useListMyPaymentsQuery();

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải...
      </div>
    );
  }

  if (isError) {
    return <p className="mt-6 text-sm text-destructive">Không tải được lịch sử giao dịch.</p>;
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-border py-14 text-center">
        <Receipt className="h-8 w-8 text-muted-foreground" />
        <p className="font-medium">Chưa có giao dịch nào</p>
        <p className="text-sm text-muted-foreground">
          Lịch sử thanh toán, hoá đơn và hoàn tiền sẽ hiện ở đây sau khi bạn đặt chỗ.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {data.items.map((payment) => (
        <PaymentCard key={payment.id} payment={payment} />
      ))}
    </div>
  );
}
