import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ExpenseController } from "./expense.controller";
import { ExpenseValidation } from "./expense.validation";

const router = express.Router();

router
  .route("/")
  .post(
    auth(),
    validateRequest(ExpenseValidation.createExpense),
    ExpenseController.createExpense,
  )
  .get(
    auth(),
    validateRequest(ExpenseValidation.getExpenses),
    ExpenseController.getExpenses,
  );

router
  .route("/:id")
  .get(
    auth(),
    validateRequest(ExpenseValidation.getExpenseById),
    ExpenseController.getExpenseById,
  )
  .patch(
    auth(),
    validateRequest(ExpenseValidation.updateExpense),
    ExpenseController.updateExpense,
  )
  .delete(
    auth(),
    validateRequest(ExpenseValidation.deleteExpense),
    ExpenseController.deleteExpense,
  );

router.get(
  "/daily-total",
  auth(),
  validateRequest(ExpenseValidation.getDailyTotal),
  ExpenseController.getDailyTotal,
);

router.get(
  "/category-total",
  auth(),
  validateRequest(ExpenseValidation.getCategoryTotal),
  ExpenseController.getCategoryTotal,
);

export const ExpenseRoutes = router;
