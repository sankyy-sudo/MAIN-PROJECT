import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { privacyController } from "../controllers/privacy.controller";

const router = Router();

router.get("/admin-route", privacyController.adminRouteConfig.bind(privacyController));
router.get("/gdpr/export", authenticate, privacyController.exportData.bind(privacyController));
router.delete("/gdpr/delete", authenticate, privacyController.deleteData.bind(privacyController));
router.get(
  "/admin/audit",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  (_req, res) => res.json({ success: true, data: { status: "Security audit foundation ready" } })
);

export default router;
