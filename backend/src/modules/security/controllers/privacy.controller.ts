import { Request, Response } from "express";
import { PrivacyService } from "../services/privacy.service";

const service = new PrivacyService();

export class PrivacyController {
  async exportData(req: Request, res: Response) {
    try {
      const data = await service.exportUserData(req.user!.id);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteData(req: Request, res: Response) {
    try {
      const data = await service.deleteUserData(req.user!.id);
      return res.json({ success: true, message: "Personal data deleted", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  adminRouteConfig(_req: Request, res: Response) {
    return res.json({
      success: true,
      data: {
        adminRoutePrefix: process.env.ADMIN_ROUTE_PREFIX || "admin-console"
      }
    });
  }
}

export const privacyController = new PrivacyController();
