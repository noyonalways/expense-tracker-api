import { catchAsync, sendResponse } from "@/utils";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.create(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAll(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    data: result.data,
    meta: result.pagination,
  });
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryService.getOne(id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
});

const updateOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryService.updateOne(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryService.deleteOne(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: category,
  });
});

export const CategoryController = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
