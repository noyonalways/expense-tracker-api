import config from "@/config";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Schema, model } from "mongoose";
import { IUser, IUserModel } from "./user.interface";

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function (next) {
  // Hash password before saving
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.SALT_ROUNDS),
    );
  }
  next();
});

userSchema.methods.isPasswordMatched = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// New method to create token
userSchema.methods.createToken = function (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) {
  return jwt.sign(payload, secret, { expiresIn });
};

// Create indexes
userSchema.index({ email: 1 }, { unique: true });

export const User = model<IUser, IUserModel>("User", userSchema);
