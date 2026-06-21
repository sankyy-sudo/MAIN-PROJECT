import { Request, Response } from "express";
import { IntegrationService } from "../services/integration.service";

const service = new IntegrationService();

export class IntegrationController {
  statuses(_req: Request, res: Response) {
    return res.json({ success: true, data: service.getStatuses() });
  }

  clientConfig(_req: Request, res: Response) {
    return res.json({ success: true, data: service.getClientConfig() });
  }

  async verifyRecaptcha(req: Request, res: Response) {
    try {
      const data = await service.verifyRecaptcha(req.body.token, req.body.action);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async shippingRateQuote(req: Request, res: Response) {
    const data = await service.getShippingRateQuote(req.body);
    return res.json({ success: true, data });
  }

  reviewsFoundation(_req: Request, res: Response) {
    return res.json({
      success: true,
      data: {
        configured: Boolean(process.env.REVIEWS_API_URL),
        message: "Reviews API foundation is ready for a provider adapter."
      }
    });
  }
}

export const integrationController = new IntegrationController();
