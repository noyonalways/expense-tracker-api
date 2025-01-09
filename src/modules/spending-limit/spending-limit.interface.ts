import { Types } from "mongoose";

export interface ISpendingLimit {
  user: Types.ObjectId;
  category: Types.ObjectId;
  amount: number;
  period: "monthly" | "weekly" | "daily";
  status: "active" | "inactive";
  startDate: Date;
  endDate: Date;
}
