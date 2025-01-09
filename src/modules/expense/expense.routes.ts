import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ExpenseController } from "./expense.controller";
import { ExpenseValidation } from "./expense.validation";

const router = express.Router();

router
  .route("/")
  .post(
    auth("admin", "user"),
    validateRequest(ExpenseValidation.create),
    ExpenseController.create,
  )
  .get(auth("admin", "user"), ExpenseController.getAll);

router.get(
  "/daily-total",
  auth("admin", "user"),
  ExpenseController.getDailyTotal,
);

router.get(
  "/category-total",
  auth("admin", "user"),
  ExpenseController.getCategoryTotal,
);

router
  .route("/:id")
  .get(auth("admin", "user"), ExpenseController.getOne)
  .patch(
    auth("admin", "user"),
    validateRequest(ExpenseValidation.update),
    ExpenseController.updateOne,
  )
  .delete(
    auth("admin", "user"),

    ExpenseController.deleteOne,
  );

export const ExpenseRoutes = router;
