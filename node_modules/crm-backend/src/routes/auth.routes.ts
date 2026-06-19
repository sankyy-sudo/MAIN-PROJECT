import { Router } from "express";

import { authController }
from "../controllers/auth.controller";

import { validate }
from "../middleware/validate.middleware";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
}
from "../validations/auth.validations";

import {
  authenticate
}
from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController)
);

router.get(
  "/profile",
  authenticate,
  authController.profile.bind(authController)
);

router.post(
  "/logout",
  authenticate,
  authController.logout.bind(authController)
);

router.post(
  "/refresh-token",
  authController.refresh.bind(authController)
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

export default router;
