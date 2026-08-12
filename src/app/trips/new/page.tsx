"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTripMutation } from "@/features/trip/api/trip.api";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { RequireAuth } from "@/shared/components/require-auth";

const schema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên chuyến đi"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function NewTripForm() {
  const router = useRouter();
  const [createTrip, { isLoading }] = useCreateTripMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const trip = await createTrip({
      title: values.title,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    }).unwrap();
    router.push(`/trips/${trip.id}`);
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-md px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Tạo lịch trình mới</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Đặt tên cho chuyến đi, bạn có thể thêm ngày và địa điểm sau.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Tên chuyến đi</Label>
            <Input id="title" placeholder="Ví dụ: Đà Nẵng 3 ngày 2 đêm" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full rounded-full">
            {isLoading ? "Đang tạo..." : "Tạo lịch trình"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function NewTripPage() {
  return (
    <>
      <Navbar />
      <RequireAuth>
        <NewTripForm />
      </RequireAuth>
      <Footer />
    </>
  );
}
