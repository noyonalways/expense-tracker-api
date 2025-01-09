import { z } from "zod";

const loginUser = z.object({
  body: z
    .object({
      email: z
        .string()
        .email("Invalid email format")
        .min(1, "Email is required"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(32, "Password cannot be more than 32 characters"),
    })
    .strict(),
});

const registerUser = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot be more than 100 characters"),
      email: z
        .string()
        .email("Invalid email format")
        .min(1, "Email is required"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(32, "Password cannot be more than 32 characters"),
    })
    .strict(),
});

export const AuthValidation = {
  loginUser,
  registerUser,
};
