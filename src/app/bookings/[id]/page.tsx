'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useIsClient } from '@/shared/hooks/use-is-client';
import { useGetBookingQuery, useCancelBookingMutation, type BookingStatus } from '@/features/booking';

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: 'Chờ xử lý',
  PAYMENT_PENDING: 'Đang chờ thanh toán',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Đã hoàn thành',
  CANCELLED: 'Đã hủy',
  REFUNDED: 'Đã hoàn tiền',
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: 'bg-[#FFF3E0] text-[#B7791F]',
  PAYMENT_PENDING: 'bg-[#FFF3E0] text-[#B7791F]',
  CONFIRMED: 'bg-[#E6F7EC] text-[#16A34A]',
  COMPLETED: 'bg-[#E6F7EC] text-[#16A34A]',
  CANCELLED: 'bg-[#FDE9E9] text-[#DC2626]',
  REFUNDED: 'bg-[#E7F0FF] text-[#2563EB]',
};

const CANCELLABLE_STATUSES: BookingStatus[] = ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED'];

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = use(params);
  const isClient = useIsClient();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: booking, isLoading, isError } = useGetBookingQuery(id, { skip: !user });
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (isClient && !user) {
    router.replace(`/login?returnTo=${encodeURIComponent(`/bookings/${id}`)}`);
    return null;
  }

  const handleCancel = async () => {
    setCancelError(null);
    try {
      await cancelBooking(id).unwrap();
    } catch {
      setCancelError('Không thể hủy đặt phòng. Thử lại sau.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {isLoading && <p className="text-center text-muted-foreground">Đang tải...</p>}
      {isError && <p className="text-center text-destructive">Không tìm thấy đặt phòng này.</p>}

      {booking && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            {booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? (
              <CheckCircle2 className="size-12 text-[#16A34A]" />
            ) : booking.status === 'CANCELLED' ? (
              <XCircle className="size-12 text-destructive" />
            ) : (
              <Clock className="size-12 text-[#B7791F]" />
            )}
            <h1 className="text-xl font-bold">Mã đặt phòng {booking.bookingCode}</h1>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[booking.status]}`}>
              {STATUS_LABELS[booking.status]}
            </span>
          </div>

          {(booking.status === 'PENDING' || booking.status === 'PAYMENT_PENDING') && (
            <p className="rounded-[var(--radius-md)] bg-secondary p-4 text-center text-sm text-muted-foreground">
              Đặt phòng của bạn đã được ghi nhận và giữ chỗ. Tripora hiện chưa tích hợp cổng thanh toán thật —
              trạng thái sẽ tự cập nhật khi thanh toán được xác nhận.
            </p>
          )}

          <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
            <h2 className="font-semibold">Chi tiết phòng</h2>
            <div className="mt-3 flex flex-col gap-2">
              {booking.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} — {new Date(item.date).toLocaleDateString('vi-VN')}
                  </span>
                  <span>{Number(item.price).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-bold">
              <span>Tổng cộng</span>
              <span className="text-primary">{Number(booking.total).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>

          {booking.refunds.length > 0 && (
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h2 className="font-semibold">Hoàn tiền</h2>
              {booking.refunds.map((refund) => (
                <div key={refund.id} className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{refund.status}</span>
                  <span>{Number(refund.amount).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>
          )}

          {cancelError && <p className="text-center text-sm text-destructive">{cancelError}</p>}

          <div className="flex flex-col items-center gap-3">
            {CANCELLABLE_STATUSES.includes(booking.status) && (
              <Button variant="outline" disabled={isCancelling} onClick={handleCancel}>
                {isCancelling ? 'Đang hủy...' : 'Hủy đặt phòng'}
              </Button>
            )}
            <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground">
              Tiếp tục tìm chỗ ở khác
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
