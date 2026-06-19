"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
const User_1 = require("../../../models/User");
const BusinessAccount_1 = require("../../b2b/models/BusinessAccount");
const Customer_1 = require("../../crm/models/Customer");
const InventoryMovement_1 = require("../../inventory/models/InventoryMovement");
const Product_1 = require("../../inventory/models/Product");
const Invoice_1 = require("../models/Invoice");
const Order_1 = require("../models/Order");
const OrderEvent_1 = require("../models/OrderEvent");
const OrderItem_1 = require("../models/OrderItem");
const Refund_1 = require("../models/Refund");
const email_1 = require("../../../utils/email");
const orderIncludes = [
    { model: OrderItem_1.OrderItem, as: "items" },
    { model: Customer_1.Customer, as: "customer" },
    { model: BusinessAccount_1.BusinessAccount, as: "businessAccount" },
    { model: User_1.User, as: "creator", attributes: ["id", "name", "email"] },
    { model: Invoice_1.Invoice, as: "invoice" }
];
const makeNumber = (value) => Number(value || 0);
const makeCode = (prefix) => `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
class OrderService {
    async createOrder(input) {
        if (!input.items?.length)
            throw new Error("Order requires at least one item");
        if (!input.shippingAddress?.trim())
            throw new Error("Shipping address is required");
        const createdOrder = await database_1.sequelize.transaction(async (transaction) => {
            const lineItems = [];
            for (const item of input.items) {
                if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
                    throw new Error("Every item quantity must be a positive whole number");
                }
                const product = await Product_1.Product.findByPk(item.productId, {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                });
                if (!product || !product.isActive)
                    throw new Error("Product not found or inactive");
                if (product.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }
                const unitPrice = item.unitPrice ?? makeNumber(product.retailPrice);
                lineItems.push({
                    product,
                    quantity: item.quantity,
                    unitPrice,
                    lineTotal: unitPrice * item.quantity
                });
            }
            const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
            const discountAmount = Math.max(makeNumber(input.discountAmount), 0);
            const taxAmount = Math.max(makeNumber(input.taxAmount), 0);
            const shippingAmount = Math.max(makeNumber(input.shippingAmount), 0);
            const totalAmount = Math.max(subtotal - discountAmount + taxAmount + shippingAmount, 0);
            const order = await Order_1.Order.create({
                orderNumber: makeCode("ORD"),
                customerId: input.customerId,
                businessAccountId: input.businessAccountId,
                subtotal,
                discountAmount,
                taxAmount,
                shippingAmount,
                totalAmount,
                shippingAddress: input.shippingAddress,
                notes: input.notes,
                createdBy: input.createdBy
            }, { transaction });
            for (const item of lineItems) {
                const previousQuantity = item.product.stockQuantity;
                const newQuantity = previousQuantity - item.quantity;
                await item.product.update({ stockQuantity: newQuantity }, { transaction });
                await OrderItem_1.OrderItem.create({
                    orderId: order.id,
                    productId: item.product.id,
                    productName: item.product.name,
                    sku: item.product.sku,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    lineTotal: item.lineTotal
                }, { transaction });
                await InventoryMovement_1.InventoryMovement.create({
                    productId: item.product.id,
                    type: InventoryMovement_1.InventoryMovementType.STOCK_OUT,
                    quantity: item.quantity,
                    previousQuantity,
                    newQuantity,
                    reason: `Order ${order.orderNumber}`,
                    reference: order.id,
                    createdBy: input.createdBy
                }, { transaction });
            }
            await OrderEvent_1.OrderEvent.create({
                orderId: order.id,
                status: Order_1.OrderStatus.PENDING,
                message: "Order created",
                createdBy: input.createdBy
            }, { transaction });
            await Invoice_1.Invoice.create({
                orderId: order.id,
                invoiceNumber: makeCode("INV"),
                amount: totalAmount
            }, { transaction });
            return this.getOrderById(order.id, transaction);
        });
        if (createdOrder) {
            const value = createdOrder.toJSON();
            const recipient = value.customer?.email ||
                value.businessAccount?.email;
            if (recipient) {
                await (0, email_1.sendTemplateEmail)(recipient, email_1.emailTemplates.orderConfirmation(value, value.items || [], value.customer?.contactPerson ||
                    value.businessAccount?.contactPerson ||
                    "Customer"));
            }
        }
        return createdOrder;
    }
    async getOrders(query) {
        const where = {};
        if (query.status)
            Object.assign(where, { status: query.status });
        if (query.search) {
            Object.assign(where, {
                [sequelize_1.Op.or]: [
                    { orderNumber: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { shippingAddress: { [sequelize_1.Op.iLike]: `%${query.search}%` } }
                ]
            });
        }
        const { rows, count } = await Order_1.Order.findAndCountAll({
            where,
            include: orderIncludes,
            distinct: true,
            order: [["createdAt", "DESC"]],
            offset: (query.page - 1) * query.limit,
            limit: query.limit
        });
        return { orders: rows, total: count, page: query.page, limit: query.limit };
    }
    async getOrderById(id, transaction) {
        return Order_1.Order.findByPk(id, { include: orderIncludes, transaction });
    }
    async updateStatus(id, status, actorId, message, location) {
        if (!Object.values(Order_1.OrderStatus).includes(status)) {
            throw new Error("Invalid order status");
        }
        const updatedOrder = await database_1.sequelize.transaction(async (transaction) => {
            const order = await Order_1.Order.findByPk(id, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!order)
                throw new Error("Order not found");
            if (order.status === Order_1.OrderStatus.CANCELLED) {
                throw new Error("A cancelled order cannot be updated");
            }
            if (status === Order_1.OrderStatus.CANCELLED) {
                const items = await OrderItem_1.OrderItem.findAll({ where: { orderId: id }, transaction });
                for (const item of items) {
                    const product = await Product_1.Product.findByPk(item.productId, {
                        transaction,
                        lock: transaction.LOCK.UPDATE
                    });
                    if (!product)
                        continue;
                    const previousQuantity = product.stockQuantity;
                    const newQuantity = previousQuantity + item.quantity;
                    await product.update({ stockQuantity: newQuantity }, { transaction });
                    await InventoryMovement_1.InventoryMovement.create({
                        productId: product.id,
                        type: InventoryMovement_1.InventoryMovementType.RETURN,
                        quantity: item.quantity,
                        previousQuantity,
                        newQuantity,
                        reason: `Cancelled order ${order.orderNumber}`,
                        reference: order.id,
                        createdBy: actorId
                    }, { transaction });
                }
            }
            await order.update({ status }, { transaction });
            await OrderEvent_1.OrderEvent.create({
                orderId: id,
                status,
                message: message || `Order status changed to ${status}`,
                location,
                createdBy: actorId
            }, { transaction });
            return order;
        });
        if (status === Order_1.OrderStatus.SHIPPED) {
            const order = await this.getOrderById(id);
            if (order) {
                const value = order.toJSON();
                const recipient = value.customer?.email ||
                    value.businessAccount?.email;
                if (recipient) {
                    await (0, email_1.sendTemplateEmail)(recipient, email_1.emailTemplates.orderShipped(value, location));
                }
            }
        }
        return updatedOrder;
    }
    async getTracking(id) {
        if (!(await Order_1.Order.findByPk(id)))
            throw new Error("Order not found");
        return OrderEvent_1.OrderEvent.findAll({
            where: { orderId: id },
            include: [{ model: User_1.User, as: "actor", attributes: ["id", "name", "email"] }],
            order: [["createdAt", "ASC"]]
        });
    }
    async getInvoice(id) {
        const invoice = await Invoice_1.Invoice.findOne({
            where: { orderId: id },
            include: [{ model: Order_1.Order, as: "order", include: orderIncludes }]
        });
        if (!invoice)
            throw new Error("Invoice not found");
        return invoice;
    }
    async createRefund(id, amount, reason, actorId) {
        const order = await Order_1.Order.findByPk(id);
        if (!order)
            throw new Error("Order not found");
        if (amount <= 0 || amount > makeNumber(order.totalAmount)) {
            throw new Error("Refund amount is invalid");
        }
        if (!reason?.trim())
            throw new Error("Refund reason is required");
        const refunded = await Refund_1.Refund.sum("amount", {
            where: {
                orderId: id,
                status: { [sequelize_1.Op.in]: [Refund_1.RefundStatus.APPROVED, Refund_1.RefundStatus.COMPLETED] }
            }
        });
        if (makeNumber(refunded) + amount > makeNumber(order.totalAmount)) {
            throw new Error("Refund exceeds the remaining refundable amount");
        }
        return Refund_1.Refund.create({
            orderId: id,
            amount,
            reason,
            status: Refund_1.RefundStatus.PENDING,
            createdBy: actorId
        });
    }
    async updateRefundStatus(refundId, status) {
        if (!Object.values(Refund_1.RefundStatus).includes(status)) {
            throw new Error("Invalid refund status");
        }
        const refund = await Refund_1.Refund.findByPk(refundId);
        if (!refund)
            throw new Error("Refund not found");
        await refund.update({ status });
        if (status === Refund_1.RefundStatus.COMPLETED) {
            const order = await Order_1.Order.findByPk(refund.orderId);
            if (order) {
                const completed = makeNumber(await Refund_1.Refund.sum("amount", {
                    where: { orderId: order.id, status: Refund_1.RefundStatus.COMPLETED }
                }));
                await order.update({
                    paymentStatus: completed >= makeNumber(order.totalAmount)
                        ? Order_1.PaymentStatus.REFUNDED
                        : Order_1.PaymentStatus.PARTIALLY_REFUNDED
                });
            }
        }
        return refund;
    }
}
exports.OrderService = OrderService;
