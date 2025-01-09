import { Schema, model } from "mongoose";
import { ISpendingLimit } from "./spending-limit.interface";

const spendingLimitSchema = new Schema<ISpendingLimit>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    period: {
      type: String,
      required: [true, "Period is required"],
      enum: ["monthly", "weekly", "daily"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["active", "inactive"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const SpendingLimit = model<ISpendingLimit>(
  "SpendingLimit",
  spendingLimitSchema,
);
