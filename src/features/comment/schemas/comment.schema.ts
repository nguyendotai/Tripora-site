import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "Vui lòng nhập nội dung").max(1000, "Nội dung tối đa 1000 ký tự"),
});

export type CommentFormValues = z.infer<typeof commentSchema>;
