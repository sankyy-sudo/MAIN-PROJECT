import { Router } from "express";
import { cmsController } from "../controllers/cms.controller";

const router = Router();

router.get("/banners", cmsController.banners.bind(cmsController));
router.get("/pages", cmsController.pages.bind(cmsController));
router.get("/pages/:slug", cmsController.pageBySlug.bind(cmsController));
router.get("/posts", cmsController.posts.bind(cmsController));
router.get("/posts/:slug", cmsController.postBySlug.bind(cmsController));
router.post("/academy/waitlist", cmsController.joinWaitlist.bind(cmsController));
router.get("/settings", cmsController.settings.bind(cmsController));

export default router;
