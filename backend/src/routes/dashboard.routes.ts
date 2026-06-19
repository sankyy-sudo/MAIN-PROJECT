import { Router } from "express";

import {
  dashboardController
} from "../controllers/dashboard.controllers";

import {
  authenticate
} from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/stats",
  authenticate,
  dashboardController.getStats.bind(
    dashboardController
  )
);

export default router;