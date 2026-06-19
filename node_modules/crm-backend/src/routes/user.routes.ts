import { Router } from "express";

import { userController }
from "../controllers/user.controller";

import {
  authenticate
}
from "../middleware/auth.middleware";

import {
  authorize
}
from "../middleware/role.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  userController.getUsers.bind(
    userController
  )
);

router.get(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  userController.getUserById.bind(
    userController
  )
);

router.post(
  "/",
  authenticate,
  authorize(
    "SUPER_ADMIN"
  ),
  userController.createUser.bind(
    userController
  )
);

router.put(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN",
    "ADMIN"
  ),
  userController.updateUser.bind(
    userController
  )
);

router.delete(
  "/:id",
  authenticate,
  authorize(
    "SUPER_ADMIN"
  ),
  userController.deleteUser.bind(
    userController
  )
);

export default router;