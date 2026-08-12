import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Vui lòng chọn số sao").max(5),
  content: z.string().max(2000, "Nội dung tối đa 2000 ký tự").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
