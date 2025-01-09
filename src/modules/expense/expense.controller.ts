import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ExpenseService } from "./expense.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.create(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const { data, pagination } = await ExpenseService.getAll(req.user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expenses retrieved successfully",
    data,
    meta: pagination,
  });
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.getOne(
    req.user,
    req.params.id,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense retrieved successfully",
    data: expense,
  });
});

const updateOne = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.updateOne(
    req.user,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense updated successfully",
    data: expense,
  });
});

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const expense = await ExpenseService.deleteOne(req.user, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense deleted successfully",
    data: expense,
  });
});

const getDailyTotal = catchAsync(async (req: Request, res: Response) => {
  const total = await ExpenseService.getDailyTotal(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Daily total retrieved successfully",
    data: total,
  });
});

const getCategoryTotal = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.getCategoryTotal(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category totals retrieved successfully",
    data: result,
  });
});

export const ExpenseController = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  getDailyTotal,
  getCategoryTotal,
};
