import { Schema, model } from "mongoose";
import { IExpense } from "./expense.interface";

const expenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Purpose must be at least 3 characters long"],
      maxlength: [200, "Purpose cannot be more than 200 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Create indexes for faster queries
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

export const Expense = model<IExpense>("Expense", expenseSchema);
