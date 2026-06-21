import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { authorize } from "../../../middleware/role.middleware";
import { cmsController } from "../controllers/cms.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"));

router.get("/banners", cmsController.banners.bind(cmsController));
router.post("/banners", cmsController.createBanner.bind(cmsController));
router.put("/banners/:id", cmsController.updateBanner.bind(cmsController));
router.delete("/banners/:id", cmsController.deleteBanner.bind(cmsController));

router.get("/pages", cmsController.pages.bind(cmsController));
router.post("/pages", cmsController.createPage.bind(cmsController));
router.put("/pages/:id", cmsController.updatePage.bind(cmsController));
router.delete("/pages/:id", cmsController.deletePage.bind(cmsController));

router.get("/posts", cmsController.posts.bind(cmsController));
router.post("/posts", cmsController.createPost.bind(cmsController));
router.put("/posts/:id", cmsController.updatePost.bind(cmsController));
router.delete("/posts/:id", cmsController.deletePost.bind(cmsController));

router.get("/academy/waitlist", cmsController.waitlist.bind(cmsController));

router.get("/settings", cmsController.settings.bind(cmsController));
router.put("/settings", cmsController.upsertSettings.bind(cmsController));

export default router;
