import { z } from "zod";

export const applyProviderSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên doanh nghiệp").max(150),
  type: z.enum(["HOTEL", "TOUR", "ACTIVITY", "TRANSPORT", "FLIGHT"]),
  contact: z.string().max(200).optional(),
  description: z.string().optional(),
});

export type ApplyProviderFormValues = z.infer<typeof applyProviderSchema>;
