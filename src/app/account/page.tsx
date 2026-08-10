'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useIsClient } from '@/shared/hooks/use-is-client';
import { useGetMyBookingsQuery, type Booking, type BookingStatus } from '@/features/booking';

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

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div>
        <p className="font-semibold">{booking.bookingCode}</p>
        <p className="text-xs text-muted-foreground">
          {booking.items[0]?.name ?? 'Booking'} · {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-primary">
          {Number(booking.total).toLocaleString('vi-VN')}đ
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[booking.status]}`}>
          {STATUS_LABELS[booking.status]}
        </span>
      </div>
    </Link>
  );
}

export default function AccountPage() {
  const isClient = useIsClient();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useGetMyBookingsQuery(undefined, { skip: !user });

  if (isClient && !user) {
    router.replace('/login?returnTo=%2Faccount');
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <User className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold">{user?.email}</h1>
          <p className="text-sm text-muted-foreground">Vai trò: {user?.role}</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold">Lịch sử đặt phòng</h2>
      <div className="mt-4 flex flex-col gap-3">
        {isLoading && <p className="text-sm text-muted-foreground">Đang tải...</p>}
        {isError && <p className="text-sm text-destructive">Không thể tải lịch sử đặt phòng.</p>}
        {data?.items.length === 0 && (
          <p className="text-sm text-muted-foreground">Bạn chưa có Booking nào.</p>
        )}
        {data?.items.map((booking) => (
          <BookingRow key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
