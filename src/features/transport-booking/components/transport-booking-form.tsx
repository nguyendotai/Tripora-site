"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Car } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TransportRoute } from "@/features/transport-route/types/transport-route.types";
import { cn } from "@/lib/utils";
import {
  useCreateTransportBookingMutation,
  useLazyListAvailableVehiclesForRouteQuery,
} from "../api/transport-booking.api";
import type { AvailableVehicleOption, TransportBooking } from "../types/transport-booking.types";
import { TransportBookingConfirmation } from "./transport-booking-confirmation";

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  CAR: "Xe 4 chỗ",
  SUV: "SUV",
  VAN: "Xe 7-16 chỗ",
  BUS: "Xe khách/Bus",
  MOTORBIKE: "Xe máy",
};

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
  numberOfPeople: z
    .string()
    .min(1, "Vui lòng nhập số người")
    .refine((v) => Number(v) >= 1, "Cần ít nhất 1 người"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function TransportBookingForm({ route }: { route: TransportRoute }) {
  const [departureDate, setDepartureDate] = useState(todayISO());
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<AvailableVehicleOption | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<TransportBooking | null>(null);

  const [findVehicles, { data: options, isFetching: isSearching }] =
    useLazyListAvailableVehiclesForRouteQuery();
  const [createTransportBooking, { isLoading: isBooking }] = useCreateTransportBookingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "", numberOfPeople: "1" },
  });

  const handleFindVehicles = () => {
    setDateError(null);
    setSelectedOption(null);
    if (departureDate < todayISO()) {
      setDateError("Ngày khởi hành phải từ hôm nay trở đi");
      return;
    }
    findVehicles({ routeId: route.id, departureDate });
  };

  const onSubmitCustomer = async (values: CustomerFormValues) => {
    setSubmitError(null);
    if (!selectedOption) return;

    const numberOfPeople = Number(values.numberOfPeople);
    if (numberOfPeople > selectedOption.vehicle.capacity) {
      setSubmitError(`Xe này chỉ chở tối đa ${selectedOption.vehicle.capacity} người`);
      return;
    }

    try {
      const result = await createTransportBooking({
        routeId: route.id,
        vehicleId: selectedOption.vehicle.id,
        departureDate,
        numberOfPeople,
        customerName: values.customerName,
        customerEmail: values.customerEmail || undefined,
        customerPhone: values.customerPhone || undefined,
      }).unwrap();
      setConfirmedBooking(result);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? ((error.data as { message?: string })?.message ?? null)
          : null;
      setSubmitError(message ?? "Đặt xe thất bại. Vui lòng thử lại.");
    }
  };

  if (confirmedBooking) {
    return <TransportBookingConfirmation booking={confirmedBooking} />;
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Đặt xe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {route.origin} → {route.destination}
          {route.estimatedDuration && <span> · {route.estimatedDuration}</span>}
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
              onChange={(event) => {
                setDepartureDate(event.target.value);
                setSelectedOption(null);
              }}
            />
          </div>
          {dateError && <p className="mt-2 text-xs text-destructive">{dateError}</p>}

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-full"
            onClick={handleFindVehicles}
            disabled={isSearching}
          >
            <CalendarCheck className="h-4 w-4" />
            {isSearching ? "Đang tìm xe..." : "Tìm xe khả dụng"}
          </Button>

          {options &&
            (options.length === 0 ? (
              <p className="mt-3 text-sm text-destructive">
                Chưa có xe nào chạy tuyến này vào ngày đã chọn.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {options.map((option) => {
                  const isSelected = selectedOption?.vehicle.id === option.vehicle.id;
                  const pricePerPerson = option.schedule.price ?? route.price;
                  return (
                    <button
                      key={option.vehicle.id}
                      type="button"
                      onClick={() => setSelectedOption(option)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-accent"
                          : "border-border hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 shrink-0 text-primary" />
                        <div>
                          <p className="font-medium">{option.vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {VEHICLE_TYPE_LABELS[option.vehicle.type] ?? option.vehicle.type} · Tối
                            đa {option.vehicle.capacity} người · Còn {option.schedule.available} chỗ
                          </p>
                        </div>
                      </div>
                      <p className="shrink-0 text-right">
                        <span className="font-bold text-primary">
                          {formatPrice(pricePerPerson, route.currency)}
                        </span>
                        <span className="block text-xs text-muted-foreground">/người</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            ))}
        </section>

        {selectedOption && (
          <form onSubmit={handleSubmit(onSubmitCustomer)} className="mt-6 space-y-4">
            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h2 className="font-semibold">Thông tin khách</h2>
              <p className="text-xs text-muted-foreground">
                Tối đa {selectedOption.vehicle.capacity} người
              </p>

              <div className="mt-3 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="numberOfPeople">Số người</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min={1}
                    max={selectedOption.vehicle.capacity}
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
              </div>
            </section>

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <Button type="submit" disabled={isBooking} className="w-full rounded-full">
              {isBooking ? "Đang đặt xe..." : "Xác nhận đặt xe"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
