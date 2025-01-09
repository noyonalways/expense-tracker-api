import { JwtPayload } from "jsonwebtoken";
import { Model } from "mongoose";

export type TUserRole = "user" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  isActive: boolean;
}

export interface IUserMethods {
  isPasswordMatched(password: string): Promise<boolean>;
  createToken(
    jwtPayload: JwtPayload,
    secret: string,
    expiresIn: string,
  ): string;
}

export type IUserModel = Model<IUser, object, IUserMethods>;
