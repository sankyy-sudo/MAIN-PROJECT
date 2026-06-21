import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { analyticsController } from "../controllers/analytics.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"));

router.get("/summary", analyticsController.summary.bind(analyticsController));
router.get("/revenue", analyticsController.revenue.bind(analyticsController));
router.get("/top-products", analyticsController.topProducts.bind(analyticsController));
router.get("/conversions", analyticsController.conversions.bind(analyticsController));
router.get("/customers", analyticsController.customers.bind(analyticsController));
router.get("/sales", analyticsController.sales.bind(analyticsController));
router.get("/leads", analyticsController.leads.bind(analyticsController));

export default router;
