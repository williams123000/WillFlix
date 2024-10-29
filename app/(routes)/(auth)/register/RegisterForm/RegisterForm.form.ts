import { z } from "zod";

export const formSchema = z
  .object({
    email: z.string().min(2, {
      message: "Email is too short",
    }),
    password: z.string().min(2, {
      message: "Password is too short",
    }),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"],
  });
