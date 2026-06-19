import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { inventoryController } from "../controllers/inventory.controller";

const router = Router();

router.use(authenticate);

router.get(
  "/movements",
  inventoryController.getMovements.bind(inventoryController)
);
router.get(
  "/low-stock",
  inventoryController.getLowStock.bind(inventoryController)
);
router.post(
  "/movements",
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  inventoryController.createMovement.bind(inventoryController)
);
router.put(
  "/thresholds/:productId",
  authorize("SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER"),
  inventoryController.updateThreshold.bind(inventoryController)
);

export default router;
