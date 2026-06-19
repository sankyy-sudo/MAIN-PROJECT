import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { categoryController } from "../controllers/category.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  categoryController.createCategory.bind(
    categoryController
  )
);

router.get(
  "/",
  authenticate,
  categoryController.getCategories.bind(
    categoryController
  )
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  categoryController.updateCategory.bind(
    categoryController
  )
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  categoryController.deleteCategory.bind(
    categoryController
  )
);

export default router;
