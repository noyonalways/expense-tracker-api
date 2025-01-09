import PaginatedQueryBuilder from "@/builder/PaginatedQueryBuilder";
import SingleDocQueryBuilder from "@/builder/SingleDocQueryBuilder";
import { AppError } from "@/errors";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import { Category } from "../category/category.model";
import { SpendingLimit } from "./spending-limit.model";
import { SpendingLimitValidation } from "./spending-limit.validation";

const calculateDateRange = (
  period: "monthly" | "weekly" | "daily",
): { startDate: Date; endDate: Date } => {
  const currentDate = new Date();
  let startDate = new Date();
  let endDate = new Date();

  switch (period) {
    case "monthly":
      // Set to first day of current month
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      // Set to last day of current month
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
      break;
    case "weekly":
      startDate = currentDate;
      endDate = new Date(currentDate);
      // Add 6 days to make it 7 days total
      endDate.setDate(endDate.getDate() + 6);
      break;
    case "daily":
      startDate = currentDate;
      endDate = currentDate;
      break;
  }

  // Set time to start and end of day
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

const create = async (
  user: JwtPayload,
  payload: z.infer<typeof SpendingLimitValidation.create>["body"],
) => {
  // Validate category exists
  const category = await Category.findById(payload.category);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Calculate date range based on period
  const { startDate, endDate } = calculateDateRange(payload.period);

  // Check for existing active spending limit for this category and date range
  const existingLimit = await SpendingLimit.findOne({
    user: user.id,
    category: new mongoose.Types.ObjectId(payload.category),
    status: "active",
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  if (existingLimit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `A spending limit already exists for ${category.name} from ${existingLimit.startDate.toLocaleDateString()} to ${existingLimit.endDate.toLocaleDateString()}`,
    );
  }

  // Create new spending limit
  const limit = await SpendingLimit.create({
    ...payload,
    user: user.id,
    category: category._id,
    startDate,
    endDate,
    status: "active",
  });

  return limit.populate(["category", "user"]);
};

const getAll = async (user: JwtPayload, query: Record<string, unknown>) => {
  const baseUrl = `/api/v1/spending-limits`;

  const queryBuilder = new PaginatedQueryBuilder(
    SpendingLimit.find({ user: user.id }),
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
  const limit = await new SingleDocQueryBuilder(
    SpendingLimit,
    { _id: id, user: user.id },
    query,
  );

  const result = await limit.populate(["category", "user"]).execute();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Spending limit not found");
  }

  return result;
};

const updateOne = async (
  user: JwtPayload,
  id: string,
  payload: z.infer<typeof SpendingLimitValidation.update>["body"],
) => {
  const limit = await SpendingLimit.findOneAndUpdate(
    { _id: id, user: user.id },
    payload,
    {
      new: true,
      runValidators: true,
    },
  ).populate(["category", "user"]);

  if (!limit) {
    throw new AppError(httpStatus.NOT_FOUND, "Spending limit not found");
  }

  return limit;
};

const deleteOne = async (user: JwtPayload, id: string) => {
  const limit = await SpendingLimit.findOneAndDelete({
    _id: id,
    user: user.id,
  }).populate(["category", "user"]);

  if (!limit) {
    throw new AppError(httpStatus.NOT_FOUND, "Spending limit not found");
  }

  return limit;
};

export const SpendingLimitService = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
