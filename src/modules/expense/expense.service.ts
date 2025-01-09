import PaginatedQueryBuilder from "@/builder/PaginatedQueryBuilder";
import SingleDocQueryBuilder from "@/builder/SingleDocQueryBuilder";
import { AppError } from "@/errors";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import { Category } from "../category/category.model";
import { SpendingLimit } from "./../spending-limit/spending-limit.model";
import { Expense } from "./expense.model";
import { ExpenseValidation } from "./expense.validation";

const create = async (
  user: JwtPayload,
  payload: z.infer<typeof ExpenseValidation.create>["body"],
) => {
  const category = await Category.findById(payload.category);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Get the current date
  const currentDate = new Date();

  // Check for existing spending limit for this category
  const limit = await SpendingLimit.findOne({
    user: user.id,
    category: category._id,
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
    status: "active",
  });

  if (!limit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No active spending limit found for this category. Please set a spending limit first.",
    );
  }

  // Calculate total expenses for the spending limit period
  const periodExpenses = await Expense.aggregate([
    {
      $match: {
        user: user.id,
        category: category._id,
        date: {
          $gte: limit.startDate,
          $lte: limit.endDate,
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

  const currentTotal = periodExpenses.length > 0 ? periodExpenses[0].total : 0;
  const newTotal = currentTotal + payload.amount;

  // Check if this expense would exceed the spending limit
  if (newTotal > limit.amount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This expense would exceed your spending limit of ${limit.amount} for this category. Current total: ${currentTotal}. Period: ${limit.startDate.toLocaleDateString()} to ${limit.endDate.toLocaleDateString()}`,
    );
  }

  const expense = await Expense.create({
    ...payload,
    user: user.id,
    category: category._id,
    date: currentDate,
  });

  return expense.populate(["category", "user"]);
};

const getAll = async (user: JwtPayload, query: Record<string, unknown>) => {
  const baseUrl = `/api/v1/expenses`;

  const queryBuilder = new PaginatedQueryBuilder(
    Expense.find({ user: user.id }),
    query,
    baseUrl,
  );

  const result = await queryBuilder
    .filter()
    .search()
    .sort()
    .selectFields()
    .populateFields(["category", "user"])
    .paginate()
    .execute();

  return result;
};

const getOne = async (
  user: JwtPayload,
  id: string,
  query: Record<string, unknown>,
) => {
  const expense = await new SingleDocQueryBuilder(
    Expense,
    { _id: id, user: user.id },
    query,
  );

  const result = await expense.populate(["category", "user"]).execute();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Expense not found");
  }

  return result;
};

const updateOne = async (
  user: JwtPayload,
  id: string,
  payload: z.infer<typeof ExpenseValidation.update>["body"],
) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: id, user: user.id },
    payload,
    {
      new: true,
      runValidators: true,
    },
  ).populate("category");

  if (!expense) {
    throw new AppError(httpStatus.NOT_FOUND, "Expense not found");
  }

  return expense;
};

const deleteOne = async (user: JwtPayload, id: string) => {
  const expense = await Expense.findOneAndDelete({
    _id: id,
    user: user.id,
  }).populate("category");

  if (!expense) {
    throw new AppError(httpStatus.NOT_FOUND, "Expense not found");
  }

  return expense;
};

const getDailyTotal = async (user: JwtPayload) => {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user.id),
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $group: {
        _id: "$category._id",
        categoryName: { $first: "$category.name" },
        categoryTotal: { $sum: "$amount" },
        expenses: {
          $push: {
            _id: "$_id",
            amount: "$amount",
            purpose: "$purpose",
            date: "$date",
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$categoryTotal" },
        categories: {
          $push: {
            categoryId: "$_id",
            name: "$categoryName",
            total: "$categoryTotal",
            expenses: "$expenses",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: "$totalAmount",
        categories: 1,
      },
    },
  ]);

  if (result.length === 0) {
    return {
      total: 0,
      categories: [],
    };
  }

  return result[0];
};

const getCategoryTotal = async (user: JwtPayload) => {
  // Get current month's start and end dates
  const currentDate = new Date();
  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const result = await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(user.id),
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $group: {
        _id: "$category._id",
        categoryName: { $first: "$category.name" },
        total: { $sum: "$amount" },
        expenses: {
          $push: {
            _id: "$_id",
            amount: "$amount",
            purpose: "$purpose",
            date: "$date",
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$total" },
        categories: {
          $push: {
            categoryId: "$_id",
            name: "$categoryName",
            total: "$total",
            expenses: "$expenses",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: "$totalAmount",
        categories: 1,
      },
    },
  ]);

  if (result.length === 0) {
    return {
      total: 0,
      categories: [],
    };
  }

  return result[0];
};

export const ExpenseService = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getDailyTotal,
  getCategoryTotal,
};
