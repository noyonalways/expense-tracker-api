import httpStatus from "http-status";
import { Types } from "mongoose";

import { IPaginationOptions } from "@/builder/interfaces/query.interface";
import QueryBuilder from "@/builder/PaginatedQueryBuilder";
import { IExpense, IExpenseFilters } from "./expense.interface";
import { Expense } from "./expense.model";

const createExpense = async (expense: IExpense) => {
  const newExpense = await Expense.create(expense);
  return newExpense.populate("category");
};

const getExpenses = async (
  filters: IExpenseFilters,
  paginationOptions: IPaginationOptions = {},
) => {
  const queryBuilder = new QueryBuilder<IExpense>(Expense, {
    exact: ["userId", "category"],
    range: ["date", "amount"],
  });

  // Apply filters
  const { user, startDate, endDate, category } = filters;
  const filterOptions: Record<string, unknown> = { user };

  if (startDate || endDate) {
    if (startDate) filterOptions.dateStart = startDate;
    if (endDate) filterOptions.dateEnd = endDate;
  }

  if (category) {
    filterOptions.category = category;
  }

  const result = await queryBuilder
    .filter(filterOptions)
    .paginate(paginationOptions)
    .populate("category")
    .execute();

  return result;
};

const getExpenseById = async (id: string) => {
  const expense = await Expense.findById(id).populate("category");
  return expense;
};

const updateExpense = async (id: string, updateData: Partial<IExpense>) => {
  const expense = await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category");

  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, "Expense not found");
  }

  return expense;
};

const deleteExpense = async (id: string) => {
  const expense = await Expense.findByIdAndDelete(id).populate("category");

  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, "Expense not found");
  }

  return expense;
};

const getDailyTotal = async (userId: Types.ObjectId, date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

const getCategoryTotal = async (
  userId: Types.ObjectId,
  categoryId: Types.ObjectId,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  const result = await Expense.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        category: new Types.ObjectId(categoryId),
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

export const ExpenseService = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDailyTotal,
  getCategoryTotal,
};
