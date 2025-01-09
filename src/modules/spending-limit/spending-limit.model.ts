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
      default: new Date(),
    },
    endDate: {
      type: Date,
      default: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  },
  {
    timestamps: true,
  },
);

// Create a compound index to ensure unique category limits per user
spendingLimitSchema.index(
  { user: 1, category: 1, startDate: 1 },
  { unique: true },
);

export const SpendingLimit = model<ISpendingLimit>(
  "SpendingLimit",
  spendingLimitSchema,
);
