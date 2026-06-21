import { NextFunction, Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

const service = new PaymentService();

export class PaymentController {
  async createIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.createPaymentIntent(
        req.body.orderId,
        req.body.currency,
        req.body.metadata
      );
      return res.status(201).json({
        success: true,
        message: "Payment intent created",
        data
      });
    } catch (error) {
      return next(error);
    }
  }

  async refund(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.refundPayment(
        req.body.paymentIntentId,
        req.body.amount ? Number(req.body.amount) : undefined
      );
      return res.json({ success: true, message: "Refund submitted", data });
    } catch (error) {
      return next(error);
    }
  }

  async bankTransfer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.createBankTransferInstruction(req.body.orderId);
      return res.status(201).json({
        success: true,
        message: "Bank transfer instructions created",
        data
      });
    } catch (error) {
      return next(error);
    }
  }

  async paypalOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await service.createPayPalOrder(req.body.orderId);
      return res.status(201).json({
        success: true,
        message: "PayPal foundation order created",
        data
      });
    } catch (error) {
      return next(error);
    }
  }

  async webhook(req: Request, res: Response) {
    try {
      const signature = req.headers["stripe-signature"];
      if (typeof signature !== "string") {
        return res.status(400).send("Missing Stripe signature");
      }
      const event = service.constructWebhookEvent(req.body as Buffer, signature);
      await service.handleWebhook(event);
      return res.json({ received: true });
    } catch (error: any) {
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}

export const paymentController = new PaymentController();
