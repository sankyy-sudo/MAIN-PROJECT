import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { integrationController } from "../controllers/integration.controller";

const router = Router();

router.get("/public/client-config", integrationController.clientConfig.bind(integrationController));
router.post("/recaptcha/verify", integrationController.verifyRecaptcha.bind(integrationController));
router.get("/reviews", integrationController.reviewsFoundation.bind(integrationController));

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN"));

router.get("/status", integrationController.statuses.bind(integrationController));
router.post("/shipping/rates", integrationController.shippingRateQuote.bind(integrationController));

export default router;
