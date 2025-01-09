import { z } from "zod";

const createExpense = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    category: z.string().min(1, "Category ID is required"),
    purpose: z
      .string()
      .min(3, "Purpose must be at least 3 characters long")
      .max(200, "Purpose cannot be more than 200 characters"),
    date: z.string().optional(),
  }),
});

const updateExpense = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    category: z.string().min(1, "Category ID is required").optional(),
    purpose: z
      .string()
      .min(3, "Purpose must be at least 3 characters long")
      .max(200, "Purpose cannot be more than 200 characters")
      .optional(),
    date: z.string().optional(),
  }),
});

const getExpenses = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    category: z.string().min(1, "Category ID is required").optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10)),
    sortBy: z
      .string()
      .optional()
      .transform((val) => val || "createdAt"),
    sortOrder: z
      .enum(["asc", "desc"])
      .optional()
      .transform((val) => val || "desc"),
  }),
});

const getExpenseById = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const deleteExpense = z.object({
  params: z.object({
    id: z.string(),
  }),
});

const getDailyTotal = z.object({
  query: z.object({
    date: z.string().optional(),
  }),
});

const getCategoryTotal = z.object({
  query: z.object({
    category: z.string().min(1, "Category ID is required"),
    startDate: z.string(),
    endDate: z.string(),
  }),
});

export const ExpenseValidation = {
  createExpense,
  updateExpense,
  getExpenses,
  getExpenseById,
  deleteExpense,
  getDailyTotal,
  getCategoryTotal,
};
