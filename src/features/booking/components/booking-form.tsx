"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Property } from "@/features/property/types/property.types";
import type { Room } from "@/features/room/types/room.types";
import { useCreateBookingMutation, useLazyCheckAvailabilityQuery } from "../api/booking.api";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

const guestSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  phone: z.string().optional(),
});

const guestsSchema = z.object({
  guests: z.array(guestSchema).min(1, "Cần ít nhất 1 khách"),
});

type GuestsFormValues = z.infer<typeof guestsSchema>;

export function BookingForm({ property, room }: { property: Property; room: Room }) {
  const [checkInDate, setCheckInDate] = useState(todayISO());
  const [checkOutDate, setCheckOutDate] = useState(tomorrowISO());
  const [couponCode, setCouponCode] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [checkAvailability, { data: availability, isFetching: isChecking }] =
    useLazyCheckAvailabilityQuery();
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestsFormValues>({
    resolver: zodResolver(guestsSchema),
    defaultValues: { guests: [{ fullName: "", email: "", phone: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "guests" });

  const handleCheckAvailability = () => {
    setDateError(null);
    if (checkInDate >= checkOutDate) {
      setDateError("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }
    checkAvailability({ roomId: room.id, checkInDate, checkOutDate });
  };

  const onSubmitGuests = async (values: GuestsFormValues) => {
    setSubmitError(null);
    try {
      const result = await createBooking({
        roomId: room.id,
        checkInDate,
        checkOutDate,
        guests: values.guests.map((guest) => ({
          fullName: guest.fullName,
          email: guest.email || undefined,
          phone: guest.phone || undefined,
        })),
        couponCode: couponCode || undefined,
      }).unwrap();
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? ((error.data as { message?: string })?.message ?? null)
          : null;
      setSubmitError(message ?? "Đặt phòng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Đặt phòng</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {property.name} — {room.name} —{" "}
          <span className="font-medium text-primary">
            {formatPrice(room.basePrice, room.currency)}
          </span>{" "}
          /đêm
        </p>

        <section className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-5">
          <h2 className="font-semibold">Chọn ngày</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="checkInDate">Nhận phòng</Label>
              <Input
                id="checkInDate"
                type="date"
                value={checkInDate}
                min={todayISO()}
                onChange={(event) => setCheckInDate(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="checkOutDate">Trả phòng</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={checkOutDate}
                min={checkInDate}
                onChange={(event) => setCheckOutDate(event.target.value)}
              />
            </div>
          </div>
          {dateError && <p className="mt-2 text-xs text-destructive">{dateError}</p>}

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-full"
            onClick={handleCheckAvailability}
            disabled={isChecking}
          >
            <CalendarCheck className="h-4 w-4" />
            {isChecking ? "Đang kiểm tra..." : "Kiểm tra phòng trống"}
          </Button>

          {availability &&
            (availability.available ? (
              <p className="mt-3 text-sm text-foreground">
                Còn phòng cho {availability.nights} đêm, tổng cộng{" "}
                <span className="font-bold text-primary">
                  {formatPrice(availability.totalPrice as string, availability.currency)}
                </span>
              </p>
            ) : (
              <p className="mt-3 text-sm text-destructive">
                Hết phòng vào: {availability.unavailableDates.join(", ")}
              </p>
            ))}
        </section>

        {availability?.available && (
          <form onSubmit={handleSubmit(onSubmitGuests)} className="mt-6 space-y-4">
            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Thông tin khách</h2>
                {(!room.capacity || fields.length < room.capacity) && (
                  <button
                    type="button"
                    onClick={() => append({ fullName: "", email: "", phone: "" })}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm khách
                  </button>
                )}
              </div>
              {room.capacity && (
                <p className="text-xs text-muted-foreground">Tối đa {room.capacity} khách</p>
              )}

              <div className="mt-3 space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-2 rounded-[var(--radius-md)] border border-border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Khách {index + 1}</p>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`guests.${index}.fullName`}>Họ tên</Label>
                      <Input
                        id={`guests.${index}.fullName`}
                        {...register(`guests.${index}.fullName`)}
                      />
                      {errors.guests?.[index]?.fullName && (
                        <p className="text-xs text-destructive">
                          {errors.guests[index]?.fullName?.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`guests.${index}.email`}>Email (tuỳ chọn)</Label>
                        <Input
                          id={`guests.${index}.email`}
                          type="email"
                          {...register(`guests.${index}.email`)}
                        />
                        {errors.guests?.[index]?.email && (
                          <p className="text-xs text-destructive">
                            {errors.guests[index]?.email?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`guests.${index}.phone`}>SĐT (tuỳ chọn)</Label>
                        <Input id={`guests.${index}.phone`} {...register(`guests.${index}.phone`)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <Label htmlFor="couponCode">Mã giảm giá (tuỳ chọn)</Label>
              <Input
                id="couponCode"
                className="mt-1.5"
                placeholder="VD: WELCOME10"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
              />
            </section>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <Button type="submit" disabled={isBooking} className="w-full rounded-full">
              {isBooking ? "Đang đặt phòng..." : "Xác nhận đặt phòng"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
