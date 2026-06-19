import { Router }
from "express";

import {
 authenticate
}
from "../../../middleware/auth.middleware";

import {
 leadController
}
from "../controllers/lead.controller";

const router =
 Router();

router.post(
 "/",
 authenticate,
 leadController.createLead
 .bind(
  leadController
 )
);

router.get(
 "/",
 authenticate,
 leadController.getLeads
 .bind(
  leadController
 )
);

router.get(
 "/:id",
 authenticate,
 leadController.getLeadById
 .bind(
  leadController
 )
);

router.put(
 "/:id",
 authenticate,
 leadController.updateLead
 .bind(
  leadController
 )
);

router.delete(
 "/:id",
 authenticate,
 leadController.deleteLead
 .bind(
  leadController
 )
);

router.get(
 "/:id/timeline",
 authenticate,
 leadController.getLeadTimeline
 .bind(
  leadController
 )
);

router.post(
 "/:id/activities",
 authenticate,
 leadController.addLeadActivity
 .bind(
  leadController
 )
);

export default router;
