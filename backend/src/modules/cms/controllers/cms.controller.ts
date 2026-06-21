import { Request, Response } from "express";
import { BannerPlacement, BannerPortal } from "../models/Banner";
import { PageType } from "../models/CmsPage";
import { ContentPostType } from "../models/ContentPost";
import { SiteSettingGroup } from "../models/SiteSetting";
import { CmsService } from "../services/cms.service";

const service = new CmsService();
const idParam = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

export class CmsController {
  async banners(req: Request, res: Response) {
    const data = await service.listBanners({
      portal: req.query.portal as BannerPortal | undefined,
      placement: req.query.placement as BannerPlacement | undefined,
      activeOnly: req.query.activeOnly === "true"
    });
    return res.json({ success: true, data });
  }

  async createBanner(req: Request, res: Response) {
    const data = await service.createBanner(req.body);
    return res.status(201).json({ success: true, data });
  }

  async updateBanner(req: Request, res: Response) {
    const data = await service.updateBanner(idParam(req.params.id), req.body);
    return data
      ? res.json({ success: true, data })
      : res.status(404).json({ success: false, message: "Banner not found" });
  }

  async deleteBanner(req: Request, res: Response) {
    const data = await service.deleteBanner(idParam(req.params.id));
    return data
      ? res.json({ success: true, message: "Banner deleted" })
      : res.status(404).json({ success: false, message: "Banner not found" });
  }

  async pages(req: Request, res: Response) {
    const data = await service.listPages({
      type: req.query.type as PageType | undefined,
      publishedOnly: req.query.publishedOnly === "true"
    });
    return res.json({ success: true, data });
  }

  async pageBySlug(req: Request, res: Response) {
    const data = await service.getPageBySlug(idParam(req.params.slug), true);
    return data
      ? res.json({ success: true, data })
      : res.status(404).json({ success: false, message: "Page not found" });
  }

  async createPage(req: Request, res: Response) {
    const data = await service.createPage(req.body);
    return res.status(201).json({ success: true, data });
  }

  async updatePage(req: Request, res: Response) {
    const data = await service.updatePage(idParam(req.params.id), req.body);
    return data
      ? res.json({ success: true, data })
      : res.status(404).json({ success: false, message: "Page not found" });
  }

  async deletePage(req: Request, res: Response) {
    const data = await service.deletePage(idParam(req.params.id));
    return data
      ? res.json({ success: true, message: "Page deleted" })
      : res.status(404).json({ success: false, message: "Page not found" });
  }

  async posts(req: Request, res: Response) {
    const data = await service.listPosts({
      type: req.query.type as ContentPostType | undefined,
      publishedOnly: req.query.publishedOnly === "true"
    });
    return res.json({ success: true, data });
  }

  async postBySlug(req: Request, res: Response) {
    const data = await service.getPostBySlug(idParam(req.params.slug), true);
    return data
      ? res.json({ success: true, data })
      : res.status(404).json({ success: false, message: "Post not found" });
  }

  async createPost(req: Request, res: Response) {
    const data = await service.createPost(req.body);
    return res.status(201).json({ success: true, data });
  }

  async updatePost(req: Request, res: Response) {
    const data = await service.updatePost(idParam(req.params.id), req.body);
    return data
      ? res.json({ success: true, data })
      : res.status(404).json({ success: false, message: "Post not found" });
  }

  async deletePost(req: Request, res: Response) {
    const data = await service.deletePost(idParam(req.params.id));
    return data
      ? res.json({ success: true, message: "Post deleted" })
      : res.status(404).json({ success: false, message: "Post not found" });
  }

  async joinWaitlist(req: Request, res: Response) {
    try {
      const data = await service.createWaitlistEntry(req.body);
      return res.status(201).json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async waitlist(_req: Request, res: Response) {
    const data = await service.listWaitlist();
    return res.json({ success: true, data });
  }

  async settings(req: Request, res: Response) {
    const data = await service.listSettings(
      req.query.group as SiteSettingGroup | undefined
    );
    return res.json({ success: true, data });
  }

  async upsertSettings(req: Request, res: Response) {
    const entries = Object.entries(req.body.values || {});
    const data = await Promise.all(
      entries.map(([key, value]) =>
        service.upsertSetting(
          req.body.group,
          key,
          typeof value === "string" ? value : JSON.stringify(value)
        )
      )
    );
    return res.json({ success: true, data });
  }
}

export const cmsController = new CmsController();
