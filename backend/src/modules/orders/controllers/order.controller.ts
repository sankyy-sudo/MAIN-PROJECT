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

  async checkout(req: Request, res: Response) {
    try {
      const data = await service.createOrderFromCart({
        customerUserId: req.user!.id,
        shippingAddress: req.body.shippingAddress,
        notes: req.body.notes,
        couponCode: req.body.couponCode,
        paymentMethod: req.body.paymentMethod,
        discountAmount:
          req.body.discountAmount === undefined
            ? undefined
            : Number(req.body.discountAmount),
        taxAmount: req.body.taxAmount === undefined ? undefined : Number(req.body.taxAmount),
        shippingAmount:
          req.body.shippingAmount === undefined ? undefined : Number(req.body.shippingAmount)
      });
      return res.status(201).json({ success: true, message: "Order created", data });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async bulkOrder(req: Request, res: Response) {
    try {
      const data = await service.createBusinessBulkOrder({
        customerUserId: req.user!.id,
        items: req.body.items,
        shippingAddress: req.body.shippingAddress,
        notes: req.body.notes,
        paymentMethod: req.body.paymentMethod
      });
      return res.status(201).json({
        success: true,
        message: "Bulk order created",
        data
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async myOrders(req: Request, res: Response) {
    const data = await service.getCustomerOrders(
      req.user!.id,
      Math.max(Number(req.query.page) || 1, 1),
      Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
    );
    return res.json({ success: true, data });
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

  async invoiceDownload(req: Request, res: Response) {
    try {
      const invoice = await service.getInvoice(param(req.params.id));
      const payload = service.renderInvoiceDocument(invoice);
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${payload.fileName}"`
      );
      return res.send(payload.content);
    } catch (error: any) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async packingSlip(req: Request, res: Response) {
    try {
      const order = await service.getOrderById(param(req.params.id));
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      const payload = service.renderPackingSlip(order);
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${payload.fileName}"`
      );
      return res.send(payload.content);
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

  async customerReturn(req: Request, res: Response) {
    try {
      const data = await service.createRefund(
        param(req.params.id),
        Number(req.body.amount),
        req.body.reason,
        req.user!.id
      );
      return res.status(201).json({
        success: true,
        message: "Return request submitted",
        data
      });
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
