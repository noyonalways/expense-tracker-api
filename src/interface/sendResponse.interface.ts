import { IPagination } from "./builder.interface";

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IPagination;
};
