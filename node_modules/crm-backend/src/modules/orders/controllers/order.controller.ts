import { Request, Response } from "express";
import { OrderStatus } from "../models/Order";
import { RefundStatus } from "../models/Refund";
import { OrderService } from "../services/order.service";

const service = new OrderService();
const param = (value: string | string[]) => Array.isArray(value) ? value[0] : value;

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const data = await service.createOrder({ ...req.body, createdBy: req.user!.id });
      return res.status(201).json({ success: true, message: "Order created", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async list(req: Request, res: Response) {
    const data = await service.getOrders({
      search: req.query.search as string | undefined,
      status: req.query.status as OrderStatus | undefined,
      page: Math.max(Number(req.query.page) || 1, 1),
      limit: Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
    });
    return res.json({ success: true, data });
  }

  async get(req: Request, res: Response) {
    const data = await service.getOrderById(param(req.params.id));
    return data
      ? res.json({ success: true, data })
      : res.status(404).json({ success: false, message: "Order not found" });
  }

  async status(req: Request, res: Response) {
    try {
      const data = await service.updateStatus(
        param(req.params.id),
        req.body.status,
        req.user!.id,
        req.body.message,
        req.body.location
      );
      return res.json({ success: true, message: "Order status updated", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async tracking(req: Request, res: Response) {
    try {
      const data = await service.getTracking(param(req.params.id));
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async invoice(req: Request, res: Response) {
    try {
      const data = await service.getInvoice(param(req.params.id));
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async refund(req: Request, res: Response) {
    try {
      const data = await service.createRefund(
        param(req.params.id),
        Number(req.body.amount),
        req.body.reason,
        req.user!.id
      );
      return res.status(201).json({ success: true, message: "Refund requested", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async refundStatus(req: Request, res: Response) {
    try {
      const data = await service.updateRefundStatus(
        param(req.params.refundId),
        req.body.status as RefundStatus
      );
      return res.json({ success: true, message: "Refund status updated", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const orderController = new OrderController();
