import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SpendingLimitService } from "./spending-limit.service";

const create = catchAsync(async (req: Request, res: Response) => {
  const limit = await SpendingLimitService.create(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Spending limit created successfully",
    data: limit,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const { data, pagination } = await SpendingLimitService.getAll(
    req.user,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spending limits retrieved successfully",
    data,
    meta: pagination,
  });
});

const getOne = catchAsync(async (req: Request, res: Response) => {
  const limit = await SpendingLimitService.getOne(
    req.user,
    req.params.id,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spending limit retrieved successfully",
    data: limit,
  });
});

const updateOne = catchAsync(async (req: Request, res: Response) => {
  const limit = await SpendingLimitService.updateOne(
    req.user,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spending limit updated successfully",
    data: limit,
  });
});

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const limit = await SpendingLimitService.deleteOne(req.user, req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Spending limit deleted successfully",
    data: limit,
  });
});

export const SpendingLimitController = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
};
