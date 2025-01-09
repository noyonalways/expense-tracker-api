import validateRequest from "@/middlewares/validateRequest";
import express from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginUser),
  AuthController.loginUser,
);

router.post(
  "/register",
  validateRequest(AuthValidation.registerUser),
  AuthController.registerUser,
);

export const AuthRoutes = router;
