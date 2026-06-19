"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../../../config/database");
const Order_1 = require("../../orders/models/Order");
const Payment_1 = require("../models/Payment");
const getStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    return new stripe_1.default(secretKey);
};
const toMinorUnits = (amount) => Math.round(amount * 100);
class PaymentService {
    async createPaymentIntent(orderId, currency = process.env.STRIPE_CURRENCY || "gbp", metadata = {}) {
        const order = await Order_1.Order.findByPk(orderId);
        if (!order)
            throw new Error("Order not found");
        if (order.paymentStatus === Order_1.PaymentStatus.PAID) {
            throw new Error("Order is already paid");
        }
        const amount = Number(order.totalAmount);
        if (amount <= 0)
            throw new Error("Order total must be greater than zero");
        const stripe = getStripe();
        const intent = await stripe.paymentIntents.create({
            amount: toMinorUnits(amount),
            currency: currency.toLowerCase(),
            automatic_payment_methods: { enabled: true },
            metadata: {
                ...metadata,
                orderId: order.id,
                orderNumber: order.orderNumber
            }
        });
        const payment = await Payment_1.Payment.create({
            orderId: order.id,
            stripePaymentIntentId: intent.id,
            amount,
            currency: intent.currency,
            metadata: intent.metadata
        });
        return {
            payment,
            paymentIntentId: intent.id,
            clientSecret: intent.client_secret
        };
    }
    async confirmPayment(paymentIntentId) {
        return database_1.sequelize.transaction(async (transaction) => {
            const payment = await Payment_1.Payment.findOne({
                where: { stripePaymentIntentId: paymentIntentId },
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!payment)
                throw new Error("Payment record not found");
            await payment.update({ status: Payment_1.PaymentRecordStatus.SUCCEEDED }, { transaction });
            await Order_1.Order.update({ paymentStatus: Order_1.PaymentStatus.PAID }, { where: { id: payment.orderId }, transaction });
            return payment;
        });
    }
    async markPaymentFailed(paymentIntentId) {
        const payment = await Payment_1.Payment.findOne({
            where: { stripePaymentIntentId: paymentIntentId }
        });
        if (!payment)
            return null;
        return payment.update({ status: Payment_1.PaymentRecordStatus.FAILED });
    }
    async refundPayment(paymentIntentId, amount) {
        const payment = await Payment_1.Payment.findOne({
            where: { stripePaymentIntentId: paymentIntentId }
        });
        if (!payment)
            throw new Error("Payment record not found");
        const stripe = getStripe();
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            ...(amount ? { amount: toMinorUnits(amount) } : {})
        });
        if (!amount || amount >= Number(payment.amount)) {
            await payment.update({ status: Payment_1.PaymentRecordStatus.REFUNDED });
            await Order_1.Order.update({ paymentStatus: Order_1.PaymentStatus.REFUNDED }, { where: { id: payment.orderId } });
        }
        else {
            await Order_1.Order.update({ paymentStatus: Order_1.PaymentStatus.PARTIALLY_REFUNDED }, { where: { id: payment.orderId } });
        }
        return refund;
    }
    constructWebhookEvent(payload, signature) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
        }
        return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
    }
    async handleWebhook(event) {
        switch (event.type) {
            case "payment_intent.succeeded":
                return this.confirmPayment(event.data.object.id);
            case "payment_intent.payment_failed":
                return this.markPaymentFailed(event.data.object.id);
            case "charge.refunded": {
                const charge = event.data.object;
                const paymentIntentId = typeof charge.payment_intent === "string"
                    ? charge.payment_intent
                    : charge.payment_intent?.id;
                if (!paymentIntentId)
                    return null;
                const payment = await Payment_1.Payment.findOne({
                    where: { stripePaymentIntentId: paymentIntentId }
                });
                if (!payment)
                    return null;
                await payment.update({ status: Payment_1.PaymentRecordStatus.REFUNDED });
                return Order_1.Order.update({ paymentStatus: Order_1.PaymentStatus.REFUNDED }, { where: { id: payment.orderId } });
            }
            default:
                return null;
        }
    }
}
exports.PaymentService = PaymentService;
