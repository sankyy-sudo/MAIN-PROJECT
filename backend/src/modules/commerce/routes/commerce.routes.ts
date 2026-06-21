import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { commerceController } from "../controllers/commerce.controller";

const router = Router();

router.post("/quote", optionalAuthenticate, commerceController.quote.bind(commerceController));

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"));

router.get("/coupons", commerceController.coupons.bind(commerceController));
router.post("/coupons", commerceController.createCoupon.bind(commerceController));
router.delete("/coupons/:id", commerceController.deleteCoupon.bind(commerceController));

router.get("/shipping-rules", commerceController.shippingRules.bind(commerceController));
router.post("/shipping-rules", commerceController.createShippingRule.bind(commerceController));
router.delete("/shipping-rules/:id", commerceController.deleteShippingRule.bind(commerceController));

router.get("/tax-settings", commerceController.taxSettings.bind(commerceController));
router.post("/tax-settings", commerceController.createTaxSetting.bind(commerceController));
router.delete("/tax-settings/:id", commerceController.deleteTaxSetting.bind(commerceController));

router.get("/settings", commerceController.settings.bind(commerceController));
router.put("/settings", commerceController.upsertSettings.bind(commerceController));

export default router;
