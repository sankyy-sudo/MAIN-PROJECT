import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { productController } from "../controllers/product.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  productController.createProduct.bind(
    productController
  )
);

router.get(
  "/",
  authenticate,
  productController.getProducts.bind(
    productController
  )
);

router.get(
  "/:id",
  authenticate,
  productController.getProductById.bind(
    productController
  )
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  productController.updateProduct.bind(
    productController
  )
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  productController.deleteProduct.bind(
    productController
  )
);

export default router;
