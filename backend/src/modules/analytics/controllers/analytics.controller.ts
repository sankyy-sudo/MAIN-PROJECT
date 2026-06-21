import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";

const service = new AnalyticsService();

export class AnalyticsController {
  async summary(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.summary() });
  }

  async revenue(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.revenueAnalytics() });
  }

  async topProducts(req: Request, res: Response) {
    return res.json({
      success: true,
      data: await service.topProducts(Number(req.query.limit || 10))
    });
  }

  async conversions(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.conversionRates() });
  }

  async customers(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.customerAnalytics() });
  }

  async sales(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.salesAnalytics() });
  }

  async leads(_req: Request, res: Response) {
    return res.json({
      success: true,
      data: await service.leadConversionAnalytics()
    });
  }
}

export const analyticsController = new AnalyticsController();
