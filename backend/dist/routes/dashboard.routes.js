"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controllers_1 = require("../controllers/dashboard.controllers");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/stats", auth_middleware_1.authenticate, dashboard_controllers_1.dashboardController.getStats.bind(dashboard_controllers_1.dashboardController));
exports.default = router;
