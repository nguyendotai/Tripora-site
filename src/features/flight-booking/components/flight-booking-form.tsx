"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Flight } from "@/features/flight/types/flight.types";
import type { FlightSchedule } from "@/features/flight-schedule/types/flight-schedule.types";
import { useListFlightSeatsQuery } from "@/features/flight-seat/api/flight-seat.api";
import type { FlightSeat } from "@/features/flight-seat/types/flight-seat.types";
import { cn } from "@/lib/utils";
import { useCreateFlightBookingMutation } from "../api/flight-booking.api";

function formatPrice(price: string) {
  return `${Number(price).toLocaleString("vi-VN")} VND`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const passengerSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  idNumber: z.string().min(1, "Vui lòng nhập CCCD/hộ chiếu"),
});

const formSchema = z.object({
  customerName: z.string().min(1, "Vui lòng nhập họ tên"),
  customerEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  passengers: z.array(passengerSchema).min(1, "Chọn ít nhất 1 ghế"),
});

type FormValues = z.infer<typeof formSchema>;
type Step = "seats" | "passengers";

export function FlightBookingForm({ flight, schedule }: { flight: Flight; schedule: FlightSchedule }) {
  const [step, setStep] = useState<Step>("seats");
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: seats,
    isLoading: isLoadingSeats,
    isError: isSeatsError,
  } = useListFlightSeatsQuery(schedule.id);
  const [createFlightBooking, { isLoading: isBooking }] = useCreateFlightBookingMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { customerName: "", customerEmail: "", customerPhone: "", passengers: [] },
  });
  const { fields, replace } = useFieldArray({ control, name: "passengers" });

  const selectedSeats = (seats ?? []).filter((seat) => selectedSeatIds.includes(seat.id));
  const economySeats = (seats ?? []).filter((seat) => seat.class === "ECONOMY");
  const businessSeats = (seats ?? []).filter((seat) => seat.class === "BUSINESS");

  const toggleSeat = (seat: FlightSeat) => {
    if (seat.status !== "AVAILABLE") return;
    setSelectedSeatIds((previous) =>
      previous.includes(seat.id)
        ? previous.filter((id) => id !== seat.id)
        : [...previous, seat.id],
    );
  };

  const goToPassengerStep = () => {
    if (selectedSeatIds.length === 0) return;
    replace(selectedSeatIds.map(() => ({ fullName: "", idNumber: "" })));
    setStep("passengers");
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const result = await createFlightBooking({
        scheduleId: schedule.id,
        seatIds: selectedSeatIds,
        passengers: values.passengers,
        customerName: values.customerName,
        customerEmail: values.customerEmail || undefined,
        customerPhone: values.customerPhone || undefined,
      }).unwrap();
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? ((error.data as { message?: string })?.message ?? null)
          : null;
      setSubmitError(message ?? "Đặt vé thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Đặt vé máy bay</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {flight.flightNumber} · {flight.departureAirport?.code} → {flight.arrivalAirport?.code}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDate(schedule.departureDate)} · {schedule.departureTime} - {schedule.arrivalTime}
        </p>

        {step === "seats" && (
          <section className="mt-6 rounded-[var(--radius-lg)] border border-border bg-card p-5">
            <h2 className="font-semibold">Chọn ghế</h2>
            <p className="text-xs text-muted-foreground">Bấm để chọn 1 hoặc nhiều ghế còn trống.</p>

            {isLoadingSeats ? (
              <p className="mt-4 text-sm text-muted-foreground">Đang tải sơ đồ ghế...</p>
            ) : isSeatsError ? (
              <p className="mt-4 text-sm text-destructive">Không tải được sơ đồ ghế.</p>
            ) : (
              <div className="mt-4 space-y-5">
                {businessSeats.length > 0 && (
                  <div>
                    <p className="flex items-center justify-between text-sm font-medium">
                      Business
                      <span className="text-xs font-normal text-muted-foreground">
                        {formatPrice(schedule.businessPrice ?? "0")}/ghế
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {businessSeats.map((seat) => (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          selected={selectedSeatIds.includes(seat.id)}
                          onToggle={() => toggleSeat(seat)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {economySeats.length > 0 && (
                  <div>
                    <p className="flex items-center justify-between text-sm font-medium">
                      Economy
                      <span className="text-xs font-normal text-muted-foreground">
                        {formatPrice(schedule.economyPrice)}/ghế
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {economySeats.map((seat) => (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          selected={selectedSeatIds.includes(seat.id)}
                          onToggle={() => toggleSeat(seat)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="button"
              className="mt-5 w-full rounded-full"
              disabled={selectedSeatIds.length === 0}
              onClick={goToPassengerStep}
            >
              Tiếp tục ({selectedSeatIds.length} ghế đã chọn)
            </Button>
          </section>
        )}

        {step === "passengers" && (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Thông tin hành khách</h2>
                <button
                  type="button"
                  onClick={() => setStep("seats")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Đổi ghế
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Ghế đã chọn: {selectedSeats.map((seat) => seat.seatNumber).join(", ")}
              </p>

              <div className="mt-3 space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-2 rounded-[var(--radius-md)] border border-border p-3"
                  >
                    <p className="text-sm font-medium">
                      Hành khách {index + 1} — Ghế {selectedSeats[index]?.seatNumber}
                    </p>
                    <div className="space-y-1.5">
                      <Label htmlFor={`passengers.${index}.fullName`}>Họ tên</Label>
                      <Input
                        id={`passengers.${index}.fullName`}
                        {...register(`passengers.${index}.fullName`)}
                      />
                      {errors.passengers?.[index]?.fullName && (
                        <p className="text-xs text-destructive">
                          {errors.passengers[index]?.fullName?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`passengers.${index}.idNumber`}>CCCD/Hộ chiếu</Label>
                      <Input
                        id={`passengers.${index}.idNumber`}
                        {...register(`passengers.${index}.idNumber`)}
                      />
                      {errors.passengers?.[index]?.idNumber && (
                        <p className="text-xs text-destructive">
                          {errors.passengers[index]?.idNumber?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <h2 className="font-semibold">Thông tin liên hệ</h2>
              <div className="mt-3 space-y-4">
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
              {isBooking ? "Đang đặt vé..." : "Xác nhận đặt vé"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

function SeatButton({
  seat,
  selected,
  onToggle,
}: {
  seat: FlightSeat;
  selected: boolean;
  onToggle: () => void;
}) {
  const disabled = seat.status !== "AVAILABLE";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      aria-pressed={selected}
      className={cn(
        "flex h-10 w-14 items-center justify-center rounded-[var(--radius-sm)] border text-xs font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed border-border bg-muted text-muted-foreground/50"
          : selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background hover:border-primary hover:bg-accent",
      )}
    >
      {seat.seatNumber}
    </button>
  );
}
