import { Router } from "express";
import { optionalAuthenticate } from "../../../middleware/auth.middleware";
import { publicCatalogController } from "../controllers/public-catalog.controller";

const router = Router();

router.get(
  "/products",
  optionalAuthenticate,
  publicCatalogController.products.bind(publicCatalogController)
);
router.get(
  "/products/:id",
  optionalAuthenticate,
  publicCatalogController.product.bind(publicCatalogController)
);
router.get(
  "/categories",
  publicCatalogController.categories.bind(publicCatalogController)
);
router.get(
  "/brands",
  publicCatalogController.brands.bind(publicCatalogController)
);

export default router;
