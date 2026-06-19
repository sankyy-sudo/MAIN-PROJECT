import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../../../middleware/auth.middleware";
import { cartController } from "../controllers/cart.controller";

const router = Router();

router.get("/", optionalAuthenticate, cartController.current.bind(cartController));
router.post("/items", optionalAuthenticate, cartController.add.bind(cartController));
router.patch("/items/:id", optionalAuthenticate, cartController.update.bind(cartController));
router.delete("/items/:id", optionalAuthenticate, cartController.remove.bind(cartController));
router.delete("/", optionalAuthenticate, cartController.clear.bind(cartController));
router.post("/merge", authenticate, cartController.merge.bind(cartController));

export default router;
