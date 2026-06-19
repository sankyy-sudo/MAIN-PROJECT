"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../../middleware/auth.middleware");
const lead_controller_1 = require("../controllers/lead.controller");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, lead_controller_1.leadController.createLead
    .bind(lead_controller_1.leadController));
router.get("/", auth_middleware_1.authenticate, lead_controller_1.leadController.getLeads
    .bind(lead_controller_1.leadController));
router.get("/:id", auth_middleware_1.authenticate, lead_controller_1.leadController.getLeadById
    .bind(lead_controller_1.leadController));
router.put("/:id", auth_middleware_1.authenticate, lead_controller_1.leadController.updateLead
    .bind(lead_controller_1.leadController));
router.delete("/:id", auth_middleware_1.authenticate, lead_controller_1.leadController.deleteLead
    .bind(lead_controller_1.leadController));
router.get("/:id/timeline", auth_middleware_1.authenticate, lead_controller_1.leadController.getLeadTimeline
    .bind(lead_controller_1.leadController));
router.post("/:id/activities", auth_middleware_1.authenticate, lead_controller_1.leadController.addLeadActivity
    .bind(lead_controller_1.leadController));
exports.default = router;
