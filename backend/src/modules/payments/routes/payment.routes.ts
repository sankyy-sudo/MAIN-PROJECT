import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { paymentController } from "../controllers/payment.controller";

const router = Router();

router.post(
  "/create-intent",
  authenticate,
  paymentController.createIntent.bind(paymentController)
);
router.post(
  "/bank-transfer",
  authenticate,
  paymentController.bankTransfer.bind(paymentController)
);
router.post(
  "/paypal/order",
  authenticate,
  paymentController.paypalOrder.bind(paymentController)
);
router.post(
  "/refund",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  paymentController.refund.bind(paymentController)
);

export default router;
