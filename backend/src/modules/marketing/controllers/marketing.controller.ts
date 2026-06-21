import { Request, Response } from "express";
import { MarketingService } from "../services/marketing.service";

const service = new MarketingService();

export class MarketingController {
  async subscribe(req: Request, res: Response) {
    try {
      const data = await service.subscribe(req.body);
      return res.status(201).json({ success: true, message: "Subscribed", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async unsubscribe(req: Request, res: Response) {
    try {
      const tokenOrEmail = req.params.token || req.body.email;
      const data = await service.unsubscribe(tokenOrEmail);
      return res.json({ success: true, message: "Unsubscribed", data });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async subscribers(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.listSubscribers() });
  }

  async campaigns(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.listCampaigns() });
  }

  async createCampaign(req: Request, res: Response) {
    const data = await service.createCampaign(req.body);
    return res.status(201).json({ success: true, data });
  }

  async automationLogs(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.listAutomationLogs() });
  }

  async runAbandonedCartJob(req: Request, res: Response) {
    const data = await service.runAbandonedCartJob({
      olderThanHours: Number(req.body.olderThanHours || 24),
      limit: Number(req.body.limit || 50)
    });
    return res.json({ success: true, message: "Abandoned cart job completed", data });
  }
}

export const marketingController = new MarketingController();
