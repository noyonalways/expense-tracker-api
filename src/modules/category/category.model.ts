import { Schema, model } from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters long"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create an index for faster queries
categorySchema.index({ name: 1 });

// Export the model
export const Category = model<ICategory>("Category", categorySchema);
