import crypto from "crypto";
import { Op } from "sequelize";
import { User } from "../../../models/User";
import { Cart } from "../../cart/models/Cart";
import { CartItem } from "../../cart/models/CartItem";
import { emailTemplates, sendEmail, sendTemplateEmail } from "../../../utils/email";
import {
  AutomationType,
  EmailAutomationLog
} from "../models/EmailAutomationLog";
import {
  MarketingCampaign
} from "../models/MarketingCampaign";
import {
  NewsletterSubscriber,
  SubscriberStatus
} from "../models/NewsletterSubscriber";

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000);

export class MarketingService {
  async subscribe(data: { email: string; name?: string; source?: string }) {
    const email = data.email.trim().toLowerCase();
    const token = crypto.randomBytes(24).toString("hex");
    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email },
      defaults: {
        email,
        name: data.name,
        source: data.source || "website",
        unsubscribeToken: token,
        status: SubscriberStatus.SUBSCRIBED
      }
    });

    if (!created) {
      await subscriber.update({
        name: data.name || subscriber.name,
        source: data.source || subscriber.source,
        status: SubscriberStatus.SUBSCRIBED,
        unsubscribedAt: null
      });
    }

    await sendEmail(
      subscriber.email,
      "Welcome to the COTECAE newsletter",
      `<h2>You're subscribed</h2><p>Thanks for joining COTECAE updates.</p>`,
      "You're subscribed to COTECAE updates."
    );
    return subscriber;
  }

  async unsubscribe(tokenOrEmail: string) {
    const subscriber = await NewsletterSubscriber.findOne({
      where: {
        [Op.or]: [
          { unsubscribeToken: tokenOrEmail },
          { email: tokenOrEmail.trim().toLowerCase() }
        ]
      }
    });
    if (!subscriber) throw new Error("Subscriber not found");
    return subscriber.update({
      status: SubscriberStatus.UNSUBSCRIBED,
      unsubscribedAt: new Date()
    });
  }

  listSubscribers() {
    return NewsletterSubscriber.findAll({ order: [["createdAt", "DESC"]] });
  }

  createCampaign(data: Partial<MarketingCampaign>) {
    return MarketingCampaign.create(data as any);
  }

  listCampaigns() {
    return MarketingCampaign.findAll({ order: [["createdAt", "DESC"]] });
  }

  listAutomationLogs() {
    return EmailAutomationLog.findAll({ order: [["createdAt", "DESC"]], limit: 100 });
  }

  async runAbandonedCartJob(options: { olderThanHours?: number; limit?: number } = {}) {
    const olderThanHours = options.olderThanHours || 24;
    const limit = options.limit || 50;
    const carts = await Cart.findAll({
      where: {
        customerId: { [Op.ne]: null },
        updatedAt: { [Op.lt]: hoursAgo(olderThanHours) },
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ model: CartItem, as: "items" }],
      limit,
      order: [["updatedAt", "ASC"]]
    });

    const sent = [];
    for (const cart of carts) {
      const items = ((cart as any).items || []) as CartItem[];
      if (!items.length) continue;

      const recentLog = await EmailAutomationLog.findOne({
        where: {
          type: AutomationType.ABANDONED_CART,
          referenceId: cart.id,
          createdAt: { [Op.gt]: hoursAgo(24) }
        }
      });
      if (recentLog) continue;

      const user = await User.findByPk(cart.customerId || "");
      if (!user?.email) continue;

      const result = await sendTemplateEmail(
        user.email,
        emailTemplates.abandonedCart(user.name || "Customer", items.length)
      );
      const log = await EmailAutomationLog.create({
        type: AutomationType.ABANDONED_CART,
        recipient: user.email,
        referenceId: cart.id,
        status: (result as any).failed ? "FAILED" : "SENT",
        sentAt: new Date(),
        metadata: { itemCount: items.length, skipped: Boolean((result as any).skipped) }
      });
      sent.push(log);
    }

    return { scanned: carts.length, sentCount: sent.length, logs: sent };
  }
}
