import { AuthRoutes } from "@/modules/auth/auth.routes";
import { CategoryRoutes } from "@/modules/category/category.routes";
import { ExpenseRoutes } from "@/modules/expense/expense.routes";
import { SpendingLimitRoutes } from "@/modules/spending-limit/spending-limit.routes";
import { Router } from "express";

const router: Router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: AuthRoutes,
  },
  {
    path: "/categories",
    routes: CategoryRoutes,
  },
  {
    path: "/spending-limits",
    routes: SpendingLimitRoutes,
  },
  {
    path: "/expenses",
    routes: ExpenseRoutes,
  },
];

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router;
