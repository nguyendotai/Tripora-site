'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useGetRoomAvailabilityQuery } from '@/features/property';
import { useCreateBookingMutation } from '@/features/booking';
import type { Room } from '@/features/property';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Trừ 1 ngày cho biên "to" khi query availability — ngày checkout không phải đêm ở lại. */
function dayBefore(dateIso: string) {
  const d = new Date(dateIso);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function BookingWidget({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0];

  const [checkIn, setCheckIn] = useState(todayIso());
  const [checkOut, setCheckOut] = useState(tomorrowIso());
  const [quantity, setQuantity] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const datesValid = checkIn < checkOut;

  const { data: availability, isFetching: isCheckingAvailability } = useGetRoomAvailabilityQuery(
    { roomId: room.id, from: checkIn, to: datesValid ? dayBefore(checkOut) : checkIn },
    { skip: !datesValid },
  );

  const nights = useMemo(() => {
    if (!datesValid) return [];
    const list: string[] = [];
    for (let d = new Date(checkIn); d < new Date(checkOut); d.setDate(d.getDate() + 1)) {
      list.push(d.toISOString().slice(0, 10));
    }
    return list;
  }, [checkIn, checkOut, datesValid]);

  const priceByDate = useMemo(() => {
    const map = new Map<string, number>();
    availability?.forEach((entry) => {
      map.set(entry.date.slice(0, 10), Number(entry.price));
    });
    return map;
  }, [availability]);

  const allNightsAvailable = nights.length > 0 && nights.every((date) => priceByDate.has(date));
  const total = nights.reduce((sum, date) => sum + (priceByDate.get(date) ?? 0), 0) * quantity;

  const handleSubmit = async () => {
    setFormError(null);

    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!datesValid) {
      setFormError('Ngày trả phòng phải sau ngày nhận phòng.');
      return;
    }
    if (!allNightsAvailable) {
      setFormError('Phòng không còn trống cho một số ngày đã chọn.');
      return;
    }

    try {
      const booking = await createBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        quantity,
        guestName: guestName || undefined,
        guestPhone: guestPhone || undefined,
        guestEmail: user.email,
      }).unwrap();
      router.push(`/bookings/${booking.id}`);
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      setFormError(data?.message ?? 'Không thể đặt phòng. Thử lại sau.');
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5">
      {rooms.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="roomId">Hạng phòng</Label>
          <select
            id="roomId"
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <span className="text-lg font-bold text-primary">
          {Number(room.basePrice).toLocaleString('vi-VN')}đ
        </span>
        <span className="text-sm text-muted-foreground"> /đêm (giá tham khảo)</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkIn">Nhận phòng</Label>
          <Input
            id="checkIn"
            type="date"
            value={checkIn}
            min={todayIso()}
            onChange={(event) => setCheckIn(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkOut">Trả phòng</Label>
          <Input
            id="checkOut"
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(event) => setCheckOut(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">Số phòng</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={20}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
        />
      </div>

      {user && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guestName">Tên khách</Label>
            <Input id="guestName" value={guestName} onChange={(event) => setGuestName(event.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guestPhone">Số điện thoại</Label>
            <Input id="guestPhone" value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} />
          </div>
        </div>
      )}

      {datesValid && (
        <div className="rounded-[var(--radius-md)] bg-secondary p-3 text-sm">
          {isCheckingAvailability ? (
            <span className="text-muted-foreground">Đang kiểm tra chỗ trống...</span>
          ) : allNightsAvailable ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {nights.length} đêm × {quantity} phòng
              </span>
              <span className="font-bold text-primary">{total.toLocaleString('vi-VN')}đ</span>
            </div>
          ) : (
            <span className="text-destructive">Phòng không còn trống cho ngày đã chọn.</span>
          )}
        </div>
      )}

      {formError && <p className="text-sm text-destructive">{formError}</p>}

      <Button
        className="rounded-full"
        disabled={isBooking || (datesValid && !allNightsAvailable)}
        onClick={handleSubmit}
      >
        {isBooking ? 'Đang đặt phòng...' : user ? 'Đặt phòng' : 'Đăng nhập để đặt phòng'}
      </Button>
    </div>
  );
}
