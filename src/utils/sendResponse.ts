import { TResponse } from "@/interface/sendResponse.interface";
import { Response } from "express";

const sendResponse = <T,>(res: Response, responseData: TResponse<T>) => {
  res.status(responseData.statusCode).json({
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
    data: responseData.data,
    meta: responseData.meta,
  });
};

export default sendResponse;
