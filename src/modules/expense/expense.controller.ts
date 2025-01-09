import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import catchAsync from "../../utils/catchAsync";

import pick from "@/utils/pick";
import sendResponse from "../../utils/sendResponse";
import { ExpenseService } from "./expense.service";

const createExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.createExpense({
    ...req.body,
    user: req.user?._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

const getExpenses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ["startDate", "endDate", "category"]);
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const result = await ExpenseService.getExpenses(
    {
      ...filters,
      user: req.user?._id,
    },
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expenses retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getExpenseById = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.getExpenseById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense retrieved successfully",
    data: expense,
  });
});

const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.updateExpense(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense updated successfully",
    data: expense,
  });
});

const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.deleteExpense(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense deleted successfully",
    data: expense,
  });
});

const getDailyTotal = catchAsync(async (req: Request, res: Response) => {
  const date = req.query.date ? new Date(req.query.date as string) : new Date();
  const total = await ExpenseService.getDailyTotal(req.user?._id, date);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Daily total retrieved successfully",
    data: { total },
  });
});

const getCategoryTotal = catchAsync(async (req: Request, res: Response) => {
  const { category, startDate, endDate } = req.query;
  const total = await ExpenseService.getCategoryTotal(
    req.user?._id,
    new Types.ObjectId(category as string),
    new Date(startDate as string),
    new Date(endDate as string),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category total retrieved successfully",
    data: { total },
  });
});

export const ExpenseController = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDailyTotal,
  getCategoryTotal,
};
