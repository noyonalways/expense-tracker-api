import { Types } from "mongoose";

export interface IExpense {
  user: Types.ObjectId;
  amount: number;
  category: Types.ObjectId;
  purpose: string;
  date: Date;
}
