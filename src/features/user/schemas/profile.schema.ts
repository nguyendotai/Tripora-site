import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên").max(100),
  lastName: z.string().min(1, "Vui lòng nhập họ").max(100),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
