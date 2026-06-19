import Stripe from "stripe";
import { sequelize } from "../../../config/database";
import { Order, PaymentStatus } from "../../orders/models/Order";
import { Payment, PaymentRecordStatus } from "../models/Payment";

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey);
};

const toMinorUnits = (amount: number) => Math.round(amount * 100);

export class PaymentService {
  async createPaymentIntent(
    orderId: string,
    currency = process.env.STRIPE_CURRENCY || "gbp",
    metadata: Record<string, string> = {}
  ) {
    const order = await Order.findByPk(orderId);
    if (!order) throw new Error("Order not found");
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new Error("Order is already paid");
    }

    const amount = Number(order.totalAmount);
    if (amount <= 0) throw new Error("Order total must be greater than zero");

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

    const payment = await Payment.create({
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

  async confirmPayment(paymentIntentId: string) {
    return sequelize.transaction(async (transaction) => {
      const payment = await Payment.findOne({
        where: { stripePaymentIntentId: paymentIntentId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!payment) throw new Error("Payment record not found");

      await payment.update(
        { status: PaymentRecordStatus.SUCCEEDED },
        { transaction }
      );
      await Order.update(
        { paymentStatus: PaymentStatus.PAID },
        { where: { id: payment.orderId }, transaction }
      );
      return payment;
    });
  }

  async markPaymentFailed(paymentIntentId: string) {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId }
    });
    if (!payment) return null;
    return payment.update({ status: PaymentRecordStatus.FAILED });
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId }
    });
    if (!payment) throw new Error("Payment record not found");

    const stripe = getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount ? { amount: toMinorUnits(amount) } : {})
    });

    if (!amount || amount >= Number(payment.amount)) {
      await payment.update({ status: PaymentRecordStatus.REFUNDED });
      await Order.update(
        { paymentStatus: PaymentStatus.REFUNDED },
        { where: { id: payment.orderId } }
      );
    } else {
      await Order.update(
        { paymentStatus: PaymentStatus.PARTIALLY_REFUNDED },
        { where: { id: payment.orderId } }
      );
    }

    return refund;
  }

  constructWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case "payment_intent.succeeded":
        return this.confirmPayment(
          (event.data.object as Stripe.PaymentIntent).id
        );
      case "payment_intent.payment_failed":
        return this.markPaymentFailed(
          (event.data.object as Stripe.PaymentIntent).id
        );
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (!paymentIntentId) return null;
        const payment = await Payment.findOne({
          where: { stripePaymentIntentId: paymentIntentId }
        });
        if (!payment) return null;
        await payment.update({ status: PaymentRecordStatus.REFUNDED });
        return Order.update(
          { paymentStatus: PaymentStatus.REFUNDED },
          { where: { id: payment.orderId } }
        );
      }
      default:
        return null;
    }
  }
}
