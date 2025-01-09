import PaginatedQueryBuilder from "@/builder/PaginatedQueryBuilder";
import SingleDocQueryBuilder from "@/builder/SingleDocQueryBuilder";
import { AppError } from "@/errors";
import httpStatus from "http-status";
import { z } from "zod";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { CategoryValidation } from "./category.validation";

// Function to create a new category
const create = async (
  payload: z.infer<typeof CategoryValidation.create>["body"],
) => {
  const existingCategory = await Category.findOne({ name: payload.name });
  if (existingCategory) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  return Category.create(payload);
};

// Function to retrieve all categories
const getAll = async (query: Record<string, unknown>) => {
  const baseUrl = `/api/v1/categories`;

  const queryBuilder = new PaginatedQueryBuilder(
    Category.find(),
    query,
    baseUrl,
  );

  const result = await queryBuilder
    .filter()
    .search()
    .sort()
    .selectFields()
    .paginate()
    .execute();

  return result;
};

// Function to retrieve a single category by ID
const getOne = async (id: string, query: Record<string, unknown>) => {
  const result = await new SingleDocQueryBuilder(
    Category,
    { _id: id },
    query,
  ).execute();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return result;
};

// Function to update an existing category
const updateOne = async (
  id: string,
  payload: z.infer<typeof CategoryValidation.update>["body"],
) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.name) {
    const existingCategory = await Category.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new AppError(httpStatus.CONFLICT, "Category name already exists");
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("-__v");

  return updatedCategory;
};

// Function to delete a category by ID
const deleteOne = async (id: string): Promise<ICategory | null> => {
  const category = await Category.findByIdAndDelete(id).select("-__v");
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

export const CategoryService = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
