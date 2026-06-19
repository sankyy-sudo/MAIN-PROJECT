"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTemplateEmail = exports.emailTemplates = exports.sendEmail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const logger_1 = require("./logger");
const brand = process.env.EMAIL_FROM_NAME || "COTECAE";
const money = (value, currency = "GBP") => new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency
}).format(Number(value));
const sendEmail = async (to, subject, html, text) => {
    const apiKey = process.env.SENDGRID_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
        logger_1.logger.warn(`Email skipped (${subject}): SendGrid is not configured`);
        return { skipped: true };
    }
    mail_1.default.setApiKey(apiKey);
    await mail_1.default.send({
        to,
        from: { email: from, name: brand },
        subject,
        html,
        text: text || html.replace(/<[^>]+>/g, " ")
    });
    return { skipped: false };
};
exports.sendEmail = sendEmail;
exports.emailTemplates = {
    orderConfirmation(order, items, customerName = "Customer") {
        const rows = items
            .map((item) => `<li>${item.productName} × ${item.quantity} — ${money(item.lineTotal)}</li>`)
            .join("");
        return {
            subject: `Order confirmed: ${order.orderNumber}`,
            html: `<h2>Thank you, ${customerName}</h2><p>Your order <strong>${order.orderNumber}</strong> is confirmed.</p><ul>${rows}</ul><p>Total: <strong>${money(order.totalAmount)}</strong></p>`,
            text: `Order ${order.orderNumber} confirmed. Total ${money(order.totalAmount)}.`
        };
    },
    orderShipped(order, trackingNumber) {
        return {
            subject: `Your order ${order.orderNumber} has shipped`,
            html: `<h2>Your order is on its way</h2><p>Order <strong>${order.orderNumber}</strong> has shipped.</p>${trackingNumber ? `<p>Tracking: ${trackingNumber}</p>` : ""}`,
            text: `Order ${order.orderNumber} has shipped.${trackingNumber ? ` Tracking: ${trackingNumber}` : ""}`
        };
    },
    passwordReset(resetLink) {
        return {
            subject: "Reset your COTECAE password",
            html: `<h2>Password reset</h2><p>This link expires in 15 minutes.</p><p><a href="${resetLink}">Reset password</a></p>`,
            text: `Reset your password: ${resetLink}`
        };
    },
    welcomeEmail(user) {
        return {
            subject: `Welcome to ${brand}`,
            html: `<h2>Welcome, ${user.name}</h2><p>Your COTECAE account is ready.</p>`,
            text: `Welcome, ${user.name}. Your COTECAE account is ready.`
        };
    },
    lowStockAlert(product, currentQty, threshold) {
        return {
            subject: `Low stock alert: ${product.name}`,
            html: `<h2>Low stock alert</h2><p>${product.name} (${product.sku}) has ${currentQty} units remaining. Alert threshold: ${threshold}.</p>`,
            text: `${product.name} (${product.sku}) has ${currentQty} units remaining. Threshold: ${threshold}.`
        };
    },
    abandonedCart(customerName, itemCount) {
        return {
            subject: "You left something in your COTECAE cart",
            html: `<h2>Your cart is waiting, ${customerName}</h2><p>You have ${itemCount} item(s) saved.</p>`,
            text: `${customerName}, you have ${itemCount} item(s) saved in your cart.`
        };
    }
};
const sendTemplateEmail = async (to, content) => {
    try {
        return await (0, exports.sendEmail)(to, content.subject, content.html, content.text);
    }
    catch (error) {
        logger_1.logger.error(`Email delivery failed (${content.subject}): ${error.message}`);
        return { skipped: false, failed: true };
    }
};
exports.sendTemplateEmail = sendTemplateEmail;
