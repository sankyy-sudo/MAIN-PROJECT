import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { customerController } from "../controllers/customer.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  customerController.createCustomer.bind(
    customerController
  )
);

router.get(
  "/",
  authenticate,
  customerController.getCustomers.bind(
    customerController
  )
);

router.get(
  "/:id/timeline",
  authenticate,
  customerController.getCustomerTimeline.bind(
    customerController
  )
);

router.post(
  "/:id/notes",
  authenticate,
  customerController.addCustomerNote.bind(
    customerController
  )
);

router.post(
  "/:id/documents",
  authenticate,
  customerController.addCustomerDocument.bind(
    customerController
  )
);

router.get(
  "/:id",
  authenticate,
  customerController.getCustomerById.bind(
    customerController
  )
);

router.put(
  "/:id",
  authenticate,
  customerController.updateCustomer.bind(
    customerController
  )
);

router.delete(
  "/:id",
  authenticate,
  customerController.deleteCustomer.bind(
    customerController
  )
);

export default router;
