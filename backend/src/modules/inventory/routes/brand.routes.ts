import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { brandController } from "../controllers/brand.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  brandController.createBrand.bind(
    brandController
  )
);

router.get(
  "/",
  authenticate,
  brandController.getBrands.bind(
    brandController
  )
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  brandController.updateBrand.bind(
    brandController
  )
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  brandController.deleteBrand.bind(
    brandController
  )
);

export default router;
