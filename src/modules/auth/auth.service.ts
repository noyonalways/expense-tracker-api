import config from "@/config";
import { AppError } from "@/errors";
import httpStatus from "http-status";
import { z } from "zod";
import { User } from "../user/user.model";
import { AuthValidation } from "./auth.validation";

const registerUser = async (
  payload: z.infer<typeof AuthValidation.registerUser>["body"],
) => {
  const { email } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  return User.create(payload);
};

const loginUser = async (
  payload: z.infer<typeof AuthValidation.loginUser>["body"],
) => {
  const { email, password } = payload;

  // Find user by email with password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is not active");
  }

  // Verify password
  const isPasswordMatched = await user.isPasswordMatched(password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect Credentials");
  }

  const jwtPayload = { id: user._id, role: user.role, email: user.email };

  const accessToken = user.createToken(
    jwtPayload,
    config.JWT_ACCESS_TOKEN_SECRET as string,
    config.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  );

  return { accessToken };
};

export const AuthService = {
  loginUser,
  registerUser,
};
