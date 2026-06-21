import { Request, Response } from "express";
import { CommerceSettingGroup } from "../models/CommerceSetting";
import { CommerceService } from "../services/commerce.service";

const service = new CommerceService();
const idParam = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

export class CommerceController {
  async quote(req: Request, res: Response) {
    try {
      const data = await service.getCartQuote({
        customerId: req.user?.id,
        sessionId: req.headers["x-cart-session-id"] as string | undefined,
        couponCode: req.body.couponCode,
        region: req.body.region
      });
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async coupons(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.listCoupons() });
  }

  async createCoupon(req: Request, res: Response) {
    return res.status(201).json({
      success: true,
      data: await service.createCoupon(req.body)
    });
  }

  async shippingRules(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.listShippingRules() });
  }

  async createShippingRule(req: Request, res: Response) {
    return res.status(201).json({
      success: true,
      data: await service.createShippingRule(req.body)
    });
  }

  async taxSettings(_req: Request, res: Response) {
    return res.json({ success: true, data: await service.listTaxSettings() });
  }

  async createTaxSetting(req: Request, res: Response) {
    return res.status(201).json({
      success: true,
      data: await service.createTaxSetting(req.body)
    });
  }

  async settings(req: Request, res: Response) {
    return res.json({
      success: true,
      data: await service.listSettings(
        req.query.group as CommerceSettingGroup | undefined
      )
    });
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

  async deleteCoupon(req: Request, res: Response) {
    const data = await service.deleteByModel("coupon", idParam(req.params.id));
    return data
      ? res.json({ success: true, message: "Coupon deleted" })
      : res.status(404).json({ success: false, message: "Coupon not found" });
  }

  async deleteShippingRule(req: Request, res: Response) {
    const data = await service.deleteByModel("shipping", idParam(req.params.id));
    return data
      ? res.json({ success: true, message: "Shipping rule deleted" })
      : res.status(404).json({ success: false, message: "Shipping rule not found" });
  }

  async deleteTaxSetting(req: Request, res: Response) {
    const data = await service.deleteByModel("tax", idParam(req.params.id));
    return data
      ? res.json({ success: true, message: "Tax setting deleted" })
      : res.status(404).json({ success: false, message: "Tax setting not found" });
  }
}

export const commerceController = new CommerceController();
