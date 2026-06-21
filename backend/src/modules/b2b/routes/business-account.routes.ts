import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { businessAccountController } from "../controllers/business-account.controller";

const router = Router();

router.post(
  "/request-access",
  authenticate,
  authorize("CUSTOMER", "SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  businessAccountController.requestBusinessAccess.bind(
    businessAccountController
  )
);

router.get(
  "/me/dashboard",
  authenticate,
  businessAccountController.myDashboard.bind(businessAccountController)
);

router.get(
  "/me/invoices",
  authenticate,
  businessAccountController.myInvoices.bind(businessAccountController)
);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  businessAccountController.createBusinessAccount.bind(
    businessAccountController
  )
);

router.get(
  "/",
  authenticate,
  businessAccountController.getBusinessAccounts.bind(
    businessAccountController
  )
);

router.get(
  "/:id/dashboard",
  authenticate,
  businessAccountController.getAccountDashboard.bind(
    businessAccountController
  )
);

router.post(
  "/:id/discount",
  authenticate,
  businessAccountController.calculateDiscount.bind(
    businessAccountController
  )
);

router.get(
  "/:id/invoices",
  authenticate,
  businessAccountController.getInvoices.bind(
    businessAccountController
  )
);

router.get(
  "/:id",
  authenticate,
  businessAccountController.getBusinessAccountById.bind(
    businessAccountController
  )
);

router.put(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  businessAccountController.updateBusinessAccount.bind(
    businessAccountController
  )
);

router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  businessAccountController.deleteBusinessAccount.bind(
    businessAccountController
  )
);

export default router;
