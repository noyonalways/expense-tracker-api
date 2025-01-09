import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router
  .route("/")
  .post(
    auth("admin"),
    validateRequest(CategoryValidation.create),
    CategoryController.create,
  )
  .get(CategoryController.getAll);

router
  .route("/:id")
  .get(CategoryController.getOne)
  .patch(
    auth("admin"),
    validateRequest(CategoryValidation.update),
    CategoryController.updateOne,
  )
  .delete(auth("admin"), CategoryController.deleteOne);

export const CategoryRoutes = router;
