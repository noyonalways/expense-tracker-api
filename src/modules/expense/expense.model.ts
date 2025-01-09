import { Schema, model } from "mongoose";
import { IExpense } from "./expense.interface";

const expenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
      minlength: [3, "Purpose must be at least 3 characters long"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Expense = model<IExpense>("Expense", expenseSchema);
