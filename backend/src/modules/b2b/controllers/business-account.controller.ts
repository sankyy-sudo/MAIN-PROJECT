import { Request, Response } from "express";
import { PricingTier } from "../models/BusinessAccount";
import { BusinessAccountService } from "../services/business-account.service";
import { generateAccessToken } from "../../../utils/jwt";

const service = new BusinessAccountService();

const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;

export class BusinessAccountController {
  async requestBusinessAccess(req: Request, res: Response) {
    try {
      const result = await service.requestBusinessAccess(req.user!.id, req.body);
      return res.status(201).json({
        success: true,
        message: "Professional access enabled",
        data: {
          ...result,
          accessToken: generateAccessToken(result.user)
        }
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async myDashboard(req: Request, res: Response) {
    try {
      const result = await service.getMyBusinessAccount(req.user!.id);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async myInvoices(req: Request, res: Response) {
    try {
      const invoices = await service.getMyInvoices(req.user!.id);
      return res.json({ success: true, data: invoices });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async createBusinessAccount(
    req: Request,
    res: Response
  ) {
    const account =
      await service.createBusinessAccount(req.body);

    return res.status(201).json({
      success: true,
      data: account
    });
  }

  async getBusinessAccounts(
    req: Request,
    res: Response
  ) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result =
      await service.getBusinessAccounts(
        page,
        limit,
        {
          search:
            req.query.search as string | undefined,
          pricingTier:
            req.query.pricingTier as
              | PricingTier
              | undefined
        }
      );

    return res.json({
      success: true,
      data: result
    });
  }

  async getBusinessAccountById(
    req: Request,
    res: Response
  ) {
    const account =
      await service.getBusinessAccountById(
        getParamId(req.params.id)
      );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Business account not found"
      });
    }

    return res.json({
      success: true,
      data: account
    });
  }

  async updateBusinessAccount(
    req: Request,
    res: Response
  ) {
    const account =
      await service.updateBusinessAccount(
        getParamId(req.params.id),
        req.body
      );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Business account not found"
      });
    }

    return res.json({
      success: true,
      data: account
    });
  }

  async deleteBusinessAccount(
    req: Request,
    res: Response
  ) {
    const account =
      await service.deleteBusinessAccount(
        getParamId(req.params.id)
      );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Business account not found"
      });
    }

    return res.json({
      success: true,
      message:
        "Business account deleted successfully"
    });
  }

  async calculateDiscount(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await service.calculateDiscountedPrice(
          getParamId(req.params.id),
          Number(req.body.basePrice)
        );

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to calculate discount"
      });
    }
  }

  async getAccountDashboard(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await service.getAccountDashboard(
          getParamId(req.params.id)
        );

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Business account not found"
      });
    }
  }

  async getInvoices(
    req: Request,
    res: Response
  ) {
    try {
      const invoices =
        await service.getInvoices(
          getParamId(req.params.id)
        );

      return res.json({
        success: true,
        data: invoices
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Business account not found"
      });
    }
  }
}

export const businessAccountController =
  new BusinessAccountController();
