import sgMail from "@sendgrid/mail";
import { logger } from "./logger";

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const brand = process.env.EMAIL_FROM_NAME || "COTECAE";
const money = (value: number | string, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency
  }).format(Number(value));

export const sendEmail = async (
  to: string | string[],
  subject: string,
  html: string,
  text?: string
) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    logger.warn(`Email skipped (${subject}): SendGrid is not configured`);
    return { skipped: true };
  }

  sgMail.setApiKey(apiKey);
  await sgMail.send({
    to,
    from: { email: from, name: brand },
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, " ")
  });
  return { skipped: false };
};

export const emailTemplates = {
  orderConfirmation(order: any, items: any[], customerName = "Customer"): EmailContent {
    const rows = items
      .map(
        (item) =>
          `<li>${item.productName} × ${item.quantity} — ${money(item.lineTotal)}</li>`
      )
      .join("");
    return {
      subject: `Order confirmed: ${order.orderNumber}`,
      html: `<h2>Thank you, ${customerName}</h2><p>Your order <strong>${order.orderNumber}</strong> is confirmed.</p><ul>${rows}</ul><p>Total: <strong>${money(order.totalAmount)}</strong></p>`,
      text: `Order ${order.orderNumber} confirmed. Total ${money(order.totalAmount)}.`
    };
  },

  orderShipped(order: any, trackingNumber?: string): EmailContent {
    return {
      subject: `Your order ${order.orderNumber} has shipped`,
      html: `<h2>Your order is on its way</h2><p>Order <strong>${order.orderNumber}</strong> has shipped.</p>${trackingNumber ? `<p>Tracking: ${trackingNumber}</p>` : ""}`,
      text: `Order ${order.orderNumber} has shipped.${trackingNumber ? ` Tracking: ${trackingNumber}` : ""}`
    };
  },

  passwordReset(resetLink: string): EmailContent {
    return {
      subject: "Reset your COTECAE password",
      html: `<h2>Password reset</h2><p>This link expires in 15 minutes.</p><p><a href="${resetLink}">Reset password</a></p>`,
      text: `Reset your password: ${resetLink}`
    };
  },

  welcomeEmail(user: { name: string }): EmailContent {
    return {
      subject: `Welcome to ${brand}`,
      html: `<h2>Welcome, ${user.name}</h2><p>Your COTECAE account is ready.</p>`,
      text: `Welcome, ${user.name}. Your COTECAE account is ready.`
    };
  },

  lowStockAlert(
    product: { name: string; sku: string },
    currentQty: number,
    threshold: number
  ): EmailContent {
    return {
      subject: `Low stock alert: ${product.name}`,
      html: `<h2>Low stock alert</h2><p>${product.name} (${product.sku}) has ${currentQty} units remaining. Alert threshold: ${threshold}.</p>`,
      text: `${product.name} (${product.sku}) has ${currentQty} units remaining. Threshold: ${threshold}.`
    };
  },

  abandonedCart(customerName: string, itemCount: number): EmailContent {
    return {
      subject: "You left something in your COTECAE cart",
      html: `<h2>Your cart is waiting, ${customerName}</h2><p>You have ${itemCount} item(s) saved.</p>`,
      text: `${customerName}, you have ${itemCount} item(s) saved in your cart.`
    };
  }
};

export const sendTemplateEmail = async (
  to: string | string[],
  content: EmailContent
) => {
  try {
    return await sendEmail(to, content.subject, content.html, content.text);
  } catch (error: any) {
    logger.error(`Email delivery failed (${content.subject}): ${error.message}`);
    return { skipped: false, failed: true };
  }
};
