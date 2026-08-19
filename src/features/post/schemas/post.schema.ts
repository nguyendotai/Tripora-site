import { z } from "zod";

export const postSchema = z.object({
  caption: z
    .string()
    .min(1, "Vui lòng chia sẻ vài dòng về chuyến đi")
    .max(2000, "Nội dung tối đa 2000 ký tự"),
  destinationId: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
