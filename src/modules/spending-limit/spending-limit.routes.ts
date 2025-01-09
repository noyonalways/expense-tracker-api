import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SpendingLimitController } from "./spending-limit.controller";
import { SpendingLimitValidation } from "./spending-limit.validation";

const router = express.Router();

router
  .route("/")
  .post(
    auth("admin", "user"),
    validateRequest(SpendingLimitValidation.create),
    SpendingLimitController.create,
  )
  .get(auth("admin", "user"), SpendingLimitController.getAll);

router
  .route("/:id")
  .get(auth("admin", "user"), SpendingLimitController.getOne)
  .patch(
    auth("admin", "user"),
    validateRequest(SpendingLimitValidation.update),
    SpendingLimitController.updateOne,
  )
  .delete(auth("admin", "user"), SpendingLimitController.deleteOne);

export const SpendingLimitRoutes = router;
