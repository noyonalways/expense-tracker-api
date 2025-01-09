import PaginatedQueryBuilder from "@/builder/PaginatedQueryBuilder";
import SingleDocQueryBuilder from "@/builder/SingleDocQueryBuilder";
import { AppError } from "@/errors";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { Category } from "../category/category.model";
import { SpendingLimit } from "./spending-limit.model";
import { SpendingLimitValidation } from "./spending-limit.validation";

const create = async (
  user: JwtPayload,
  payload: z.infer<typeof SpendingLimitValidation.create>["body"],
) => {
  const category = await Category.findById(payload.category);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const limit = await SpendingLimit.create({
    ...payload,
    user: user.id,
    category: category._id,
  });

  return limit.populate(["user", "category"]);
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
    .populateFields(["user", "category"])
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

  const result = await limit.populate(["user", "category"]).execute();

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
  );

  if (!limit) {
    throw new AppError(httpStatus.NOT_FOUND, "Spending limit not found");
  }

  return limit;
};

const deleteOne = async (user: JwtPayload, id: string) => {
  const limit = await SpendingLimit.findOneAndDelete({
    _id: id,
    user: user.id,
  });

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
