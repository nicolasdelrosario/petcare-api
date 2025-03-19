import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string().email(),
  }),
  token: z.string(),
});
