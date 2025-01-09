import { Types } from "mongoose";
import { ICategory } from "../category/category.interface";
import { IUser } from "../user/user.interface";

export interface IExpense {
  user: Types.ObjectId | IUser;
  amount: number;
  category: Types.ObjectId | ICategory;
  purpose: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpenseFilters {
  user: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  category?: Types.ObjectId;
}
