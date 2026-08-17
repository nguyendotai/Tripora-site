"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Experience } from "@/features/experience/types/experience.types";
import {
  useCreateExperienceBookingMutation,
  useLazyCheckExperienceAvailabilityQuery,
} from "../api/experience-booking.api";

function formatPrice(price: string, currency: string) {
  return `${Number(price).toLocaleString("vi-VN")} ${currency}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const customerSchema = z.object({
  customerName: z.string().min(1, "Vui lòng nhập họ tên"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  couponCode: z.string().optional(),
  numberOfPeople: z
    .string()
    .min(1, "Vui lòng nhập số người")
    .refine((v) => Number(v) >= 1, "Cần ít nhất 1 người"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function ExperienceBookingForm({ experience }: { experience: Experience }) {
  const [departureDate, setDepartureDate] = useState(todayISO());
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [checkAvailability, { data: availability, isFetching: isChecking }] =
    useLazyCheckExperienceAvailabilityQuery();
  const [createExperienceBooking, { isLoading: isBooking }] = useCreateExperienceBookingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      couponCode: "",
      numberOfPeople: "1",
    },
  });

  const handleCheckAvailability = () => {
    setDateError(null);
    if (departureDate < todayISO()) {
      setDateError("Ngày khởi hành phải từ hôm nay trở đi");
      return;
    }
    checkAvailability({ experienceId: experience.id, departureDate });
  };

  const onSubmitCustomer = async (values: CustomerFormValues) => {
    setSubmitError(null);
    const numberOfPeople = Number(values.numberOfPeople);
    if (experience.maxParticipants && numberOfPeople > experience.maxParticipants) {
      setSubmitError(`Experience này chỉ nhận tối đa ${experience.maxParticipants} người`);
      return;
    }

    try {
      const result = await createExperienceBooking({
        experienceId: experience.id,
        departureDate,
        numberOfPeople,
        customerName: values.customerName,
        customerEmail: values.customerEmail || undefined,
        customerPhone: values.customerPhone || undefined,
        couponCode: values.couponCode || undefined,
      }).unwrap();
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? ((error.data as { message?: string })?.message ?? null)
          : null;
      setSubmitError(message ?? "Đặt experience thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Đặt experience</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {experience.title} —{" "}
          <span className="font-medium text-primary">
            {formatPrice(experience.price, experience.currency)}
          </span>{" "}
          /người
        </p>

        <section className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-5">
          <h2 className="font-semibold">Chọn ngày khởi hành</h2>
          <div className="mt-3 space-y-1.5">
            <Label htmlFor="departureDate">Ngày khởi hành</Label>
            <Input
              id="departureDate"
              type="date"
              value={departureDate}
              min={todayISO()}
              onChange={(event) => setDepartureDate(event.target.value)}
            />
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
            {isChecking ? "Đang kiểm tra..." : "Kiểm tra chỗ trống"}
          </Button>

          {availability &&
            (availability.available ? (
              <p className="mt-3 text-sm text-foreground">
                Còn {availability.availableSeats} chỗ, giá{" "}
                <span className="font-bold text-primary">
                  {formatPrice(availability.pricePerPerson as string, availability.currency)}
                </span>{" "}
                /người
              </p>
            ) : (
              <p className="mt-3 text-sm text-destructive">
                Experience chưa mở lịch khởi hành hoặc đã hết chỗ vào ngày này.
              </p>
            ))}
        </section>

        {availability?.available && (
          <form onSubmit={handleSubmit(onSubmitCustomer)} className="mt-6 space-y-4">
            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h2 className="font-semibold">Thông tin khách</h2>
              {experience.maxParticipants && (
                <p className="text-xs text-muted-foreground">
                  Tối đa {experience.maxParticipants} người
                </p>
              )}

              <div className="mt-3 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="numberOfPeople">Số người</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min={1}
                    max={experience.maxParticipants ?? undefined}
                    {...register("numberOfPeople")}
                  />
                  {errors.numberOfPeople && (
                    <p className="text-xs text-destructive">{errors.numberOfPeople.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerName">Họ tên người liên hệ</Label>
                  <Input id="customerName" {...register("customerName")} />
                  {errors.customerName && (
                    <p className="text-xs text-destructive">{errors.customerName.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerEmail">Email (tuỳ chọn)</Label>
                    <Input id="customerEmail" type="email" {...register("customerEmail")} />
                    {errors.customerEmail && (
                      <p className="text-xs text-destructive">{errors.customerEmail.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="customerPhone">SĐT (tuỳ chọn)</Label>
                    <Input id="customerPhone" {...register("customerPhone")} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="couponCode">Mã giảm giá (tuỳ chọn)</Label>
                  <Input id="couponCode" placeholder="VD: WELCOME10" {...register("couponCode")} />
                </div>
              </div>
            </section>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <Button type="submit" disabled={isBooking} className="w-full rounded-full">
              {isBooking ? "Đang đặt experience..." : "Xác nhận đặt experience"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
