import { z } from 'zod';

export const partnerFormSchema = z.object({
  businessName: z.string().min(1, 'Vui lòng nhập tên doanh nghiệp').max(255),
  businessType: z.enum(['HOTEL', 'TOUR', 'RESTAURANT', 'VEHICLE'], { message: 'Vui lòng chọn loại hình' }),
  contactPhone: z.string().max(20).optional().or(z.literal('')),
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
