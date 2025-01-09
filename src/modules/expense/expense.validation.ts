import mongoose from "mongoose";
import { z } from "zod";

const create = z.object({
  body: z
    .object({
      amount: z
        .number({
          required_error: "Amount is required",
          invalid_type_error: "Amount must be a number",
        })
        .positive("Amount must be positive"),
      category: z
        .string({
          required_error: "Category is required",
          invalid_type_error: "Category must be a string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid Category ID",
        }),
      purpose: z
        .string({
          required_error: "Purpose is required",
          invalid_type_error: "Purpose must be a string",
        })
        .min(3, "Purpose must be at least 3 characters long")
        .max(200, "Purpose cannot be more than 200 characters"),
    })
    .strict(),
});

const update = z.object({
  body: z
    .object({
      amount: z.number().positive("Amount must be positive").optional(),
      category: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid Category ID",
        })
        .optional(),
      purpose: z
        .string()
        .min(3, "Purpose must be at least 3 characters long")
        .max(200, "Purpose cannot be more than 200 characters")
        .optional(),
      date: z.string().datetime().optional(),
    })
    .strict(),
});

export const ExpenseValidation = {
  create,
  update,
};
