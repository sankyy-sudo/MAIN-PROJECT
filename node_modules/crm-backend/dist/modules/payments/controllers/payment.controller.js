"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const service = new payment_service_1.PaymentService();
class PaymentController {
    async createIntent(req, res, next) {
        try {
            const data = await service.createPaymentIntent(req.body.orderId, req.body.currency, req.body.metadata);
            return res.status(201).json({
                success: true,
                message: "Payment intent created",
                data
            });
        }
        catch (error) {
            return next(error);
        }
    }
    async refund(req, res, next) {
        try {
            const data = await service.refundPayment(req.body.paymentIntentId, req.body.amount ? Number(req.body.amount) : undefined);
            return res.json({ success: true, message: "Refund submitted", data });
        }
        catch (error) {
            return next(error);
        }
    }
    async webhook(req, res) {
        try {
            const signature = req.headers["stripe-signature"];
            if (typeof signature !== "string") {
                return res.status(400).send("Missing Stripe signature");
            }
            const event = service.constructWebhookEvent(req.body, signature);
            await service.handleWebhook(event);
            return res.json({ received: true });
        }
        catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
