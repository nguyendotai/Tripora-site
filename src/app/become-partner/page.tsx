'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAppSelector } from '@/shared/hooks/use-app-selector';
import { useIsClient } from '@/shared/hooks/use-is-client';
import {
  useCreatePartnerMutation,
  useGetMyPartnerQuery,
  partnerFormSchema,
  type PartnerFormValues,
} from '@/features/partner';

const BUSINESS_TYPES: { value: PartnerFormValues['businessType']; label: string }[] = [
  { value: 'HOTEL', label: 'Khách sạn / Resort' },
  { value: 'TOUR', label: 'Tour & trải nghiệm' },
  { value: 'RESTAURANT', label: 'Nhà hàng' },
  { value: 'VEHICLE', label: 'Cho thuê xe' },
];

const STATUS_MESSAGES: Record<string, string> = {
  PENDING: 'Hồ sơ của bạn đang chờ Tripora duyệt. Chúng tôi sẽ thông báo qua email khi có kết quả.',
  VERIFIED: 'Hồ sơ của bạn đã được duyệt! Đăng nhập vào Tripora Admin bằng tài khoản này để bắt đầu đăng Property.',
  REJECTED: 'Hồ sơ của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.',
};

export default function BecomePartnerPage() {
  const isClient = useIsClient();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: partner, isLoading: isCheckingPartner, isError: hasNoPartner } = useGetMyPartnerQuery(undefined, {
    skip: !user,
  });
  const [createPartner, { isLoading: isSubmitting }] = useCreatePartnerMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: { businessName: '', businessType: 'HOTEL', contactPhone: '' },
  });

  if (isClient && !user) {
    router.replace('/login?returnTo=%2Fbecome-partner');
    return null;
  }

  const onSubmit = async (values: PartnerFormValues) => {
    setFormError(null);
    try {
      await createPartner({
        businessName: values.businessName,
        businessType: values.businessType,
        ...(values.contactPhone ? { contactPhone: values.contactPhone } : {}),
      }).unwrap();
      setSubmitted(true);
    } catch {
      setFormError('Không thể gửi đăng ký. Thử lại sau.');
    }
  };

  const existingStatus = submitted ? 'PENDING' : partner?.verificationStatus;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Trở thành đối tác Tripora</CardTitle>
          <p className="text-sm text-muted-foreground">
            Đăng ký kinh doanh khách sạn, tour hoặc dịch vụ du lịch trên Tripora.
          </p>
        </CardHeader>
        <CardContent>
          {isCheckingPartner && <p className="text-sm text-muted-foreground">Đang kiểm tra...</p>}

          {!isCheckingPartner && existingStatus && (
            <p className="rounded-[var(--radius-md)] bg-secondary p-4 text-sm">
              {STATUS_MESSAGES[existingStatus]}
            </p>
          )}

          {!isCheckingPartner && !existingStatus && hasNoPartner && (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessName">Tên doanh nghiệp</Label>
                <Input id="businessName" {...register('businessName')} />
                {errors.businessName && (
                  <p className="text-xs text-destructive">{errors.businessName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="businessType">Loại hình kinh doanh</Label>
                <select
                  id="businessType"
                  {...register('businessType')}
                  className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {BUSINESS_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contactPhone">Số điện thoại liên hệ</Label>
                <Input id="contactPhone" {...register('contactPhone')} />
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <Button type="submit" disabled={isSubmitting} className="mt-2 rounded-full">
                {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
