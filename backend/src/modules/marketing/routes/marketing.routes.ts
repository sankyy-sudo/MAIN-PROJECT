import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { marketingController } from "../controllers/marketing.controller";

const router = Router();

router.post("/newsletter/subscribe", marketingController.subscribe.bind(marketingController));
router.post("/newsletter/unsubscribe", marketingController.unsubscribe.bind(marketingController));
router.get("/newsletter/unsubscribe/:token", marketingController.unsubscribe.bind(marketingController));

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"));

router.get("/newsletter/subscribers", marketingController.subscribers.bind(marketingController));
router.get("/campaigns", marketingController.campaigns.bind(marketingController));
router.post("/campaigns", marketingController.createCampaign.bind(marketingController));
router.get("/automation/logs", marketingController.automationLogs.bind(marketingController));
router.post(
  "/automation/abandoned-cart/run",
  marketingController.runAbandonedCartJob.bind(marketingController)
);

export default router;
