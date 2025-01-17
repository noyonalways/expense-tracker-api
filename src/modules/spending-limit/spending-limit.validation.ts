import mongoose from "mongoose";
import { z } from "zod";

const create = z.object({
  body: z
    .object({
      category: z
        .string({
          required_error: "Category is required",
          invalid_type_error: "Category must be a string",
        })
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid Category ID",
        }),
      amount: z
        .number({
          required_error: "Amount is required",
          invalid_type_error: "Amount must be a number",
        })
        .positive("Amount must be positive"),
      period: z.enum(["monthly", "weekly", "daily"], {
        required_error: "Period is required",
        invalid_type_error: "Period must be monthly, weekly, or daily",
      }),
    })
    .strict(),
});

const update = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid Spending Limit ID",
    }),
  }),
  body: z
    .object({
      amount: z.number().positive("Amount must be positive").optional(),
      period: z.enum(["monthly", "weekly", "daily"]).optional(),
      status: z.enum(["active", "inactive"]).optional(),
    })
    .strict(),
});

export const SpendingLimitValidation = {
  create,
  update,
};
