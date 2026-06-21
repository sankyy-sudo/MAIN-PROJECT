import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { orderController } from "../controllers/order.controller";

const router = Router();
router.use(authenticate);

router.get("/my", orderController.myOrders.bind(orderController));
router.post(
  "/checkout",
  authorize("CUSTOMER", "SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  orderController.checkout.bind(orderController)
);
router.post(
  "/bulk",
  authorize("CUSTOMER", "SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  orderController.bulkOrder.bind(orderController)
);
router.get("/", orderController.list.bind(orderController));
router.post(
  "/",
  authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  orderController.create.bind(orderController)
);
router.get("/:id/tracking", orderController.tracking.bind(orderController));
router.get("/:id/invoice", orderController.invoice.bind(orderController));
router.get("/:id/invoice/download", orderController.invoiceDownload.bind(orderController));
router.get("/:id/packing-slip", orderController.packingSlip.bind(orderController));
router.post(
  "/:id/returns",
  authorize("CUSTOMER", "SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  orderController.customerReturn.bind(orderController)
);
router.post(
  "/:id/refunds",
  authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  orderController.refund.bind(orderController)
);
router.patch(
  "/refunds/:refundId/status",
  authorize("SUPER_ADMIN", "ADMIN"),
  orderController.refundStatus.bind(orderController)
);
router.patch(
  "/:id/status",
  authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER", "INVENTORY_MANAGER"),
  orderController.status.bind(orderController)
);
router.get("/:id", orderController.get.bind(orderController));

export default router;
