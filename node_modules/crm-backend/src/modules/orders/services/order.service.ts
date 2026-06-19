import { Op, WhereOptions } from "sequelize";
import { sequelize } from "../../../config/database";
import { User } from "../../../models/User";
import { BusinessAccount } from "../../b2b/models/BusinessAccount";
import { Customer } from "../../crm/models/Customer";
import {
  InventoryMovement,
  InventoryMovementType
} from "../../inventory/models/InventoryMovement";
import { Product } from "../../inventory/models/Product";
import { Invoice } from "../models/Invoice";
import { Order, OrderStatus, PaymentStatus } from "../models/Order";
import { OrderEvent } from "../models/OrderEvent";
import { OrderItem } from "../models/OrderItem";
import { Refund, RefundStatus } from "../models/Refund";

interface CreateOrderItem {
  productId: string;
  quantity: number;
  unitPrice?: number;
}

interface CreateOrderInput {
  customerId?: string;
  businessAccountId?: string;
  items: CreateOrderItem[];
  discountAmount?: number;
  taxAmount?: number;
  shippingAmount?: number;
  shippingAddress: string;
  notes?: string;
  createdBy: string;
}

interface OrderQuery {
  search?: string;
  status?: OrderStatus;
  page: number;
  limit: number;
}

const orderIncludes = [
  { model: OrderItem, as: "items" },
  { model: Customer, as: "customer" },
  { model: BusinessAccount, as: "businessAccount" },
  { model: User, as: "creator", attributes: ["id", "name", "email"] },
  { model: Invoice, as: "invoice" }
];

const makeNumber = (value: unknown) => Number(value || 0);
const makeCode = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    if (!input.items?.length) throw new Error("Order requires at least one item");
    if (!input.shippingAddress?.trim()) throw new Error("Shipping address is required");

    return sequelize.transaction(async (transaction) => {
      const lineItems: Array<{
        product: Product;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
      }> = [];

      for (const item of input.items) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error("Every item quantity must be a positive whole number");
        }

        const product = await Product.findByPk(item.productId, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });
        if (!product || !product.isActive) throw new Error("Product not found or inactive");
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
      const totalAmount = Math.max(
        subtotal - discountAmount + taxAmount + shippingAmount,
        0
      );

      const order = await Order.create(
        {
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
        },
        { transaction }
      );

      for (const item of lineItems) {
        const previousQuantity = item.product.stockQuantity;
        const newQuantity = previousQuantity - item.quantity;

        await item.product.update({ stockQuantity: newQuantity }, { transaction });
        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.product.id,
            productName: item.product.name,
            sku: item.product.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal
          },
          { transaction }
        );
        await InventoryMovement.create(
          {
            productId: item.product.id,
            type: InventoryMovementType.STOCK_OUT,
            quantity: item.quantity,
            previousQuantity,
            newQuantity,
            reason: `Order ${order.orderNumber}`,
            reference: order.id,
            createdBy: input.createdBy
          },
          { transaction }
        );
      }

      await OrderEvent.create(
        {
          orderId: order.id,
          status: OrderStatus.PENDING,
          message: "Order created",
          createdBy: input.createdBy
        },
        { transaction }
      );

      await Invoice.create(
        {
          orderId: order.id,
          invoiceNumber: makeCode("INV"),
          amount: totalAmount
        },
        { transaction }
      );

      return this.getOrderById(order.id, transaction);
    });
  }

  async getOrders(query: OrderQuery) {
    const where: WhereOptions = {};
    if (query.status) Object.assign(where, { status: query.status });
    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          { orderNumber: { [Op.iLike]: `%${query.search}%` } },
          { shippingAddress: { [Op.iLike]: `%${query.search}%` } }
        ]
      });
    }

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: orderIncludes,
      distinct: true,
      order: [["createdAt", "DESC"]],
      offset: (query.page - 1) * query.limit,
      limit: query.limit
    });
    return { orders: rows, total: count, page: query.page, limit: query.limit };
  }

  async getOrderById(id: string, transaction?: any) {
    return Order.findByPk(id, { include: orderIncludes, transaction });
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    actorId: string,
    message?: string,
    location?: string
  ) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new Error("Invalid order status");
    }

    return sequelize.transaction(async (transaction) => {
      const order = await Order.findByPk(id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });
      if (!order) throw new Error("Order not found");
      if (order.status === OrderStatus.CANCELLED) {
        throw new Error("A cancelled order cannot be updated");
      }

      if (status === OrderStatus.CANCELLED) {
        const items = await OrderItem.findAll({ where: { orderId: id }, transaction });
        for (const item of items) {
          const product = await Product.findByPk(item.productId, {
            transaction,
            lock: transaction.LOCK.UPDATE
          });
          if (!product) continue;
          const previousQuantity = product.stockQuantity;
          const newQuantity = previousQuantity + item.quantity;
          await product.update({ stockQuantity: newQuantity }, { transaction });
          await InventoryMovement.create(
            {
              productId: product.id,
              type: InventoryMovementType.RETURN,
              quantity: item.quantity,
              previousQuantity,
              newQuantity,
              reason: `Cancelled order ${order.orderNumber}`,
              reference: order.id,
              createdBy: actorId
            },
            { transaction }
          );
        }
      }

      await order.update({ status }, { transaction });
      await OrderEvent.create(
        {
          orderId: id,
          status,
          message: message || `Order status changed to ${status}`,
          location,
          createdBy: actorId
        },
        { transaction }
      );
      return order;
    });
  }

  async getTracking(id: string) {
    if (!(await Order.findByPk(id))) throw new Error("Order not found");
    return OrderEvent.findAll({
      where: { orderId: id },
      include: [{ model: User, as: "actor", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "ASC"]]
    });
  }

  async getInvoice(id: string) {
    const invoice = await Invoice.findOne({
      where: { orderId: id },
      include: [{ model: Order, as: "order", include: orderIncludes }]
    });
    if (!invoice) throw new Error("Invoice not found");
    return invoice;
  }

  async createRefund(id: string, amount: number, reason: string, actorId: string) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error("Order not found");
    if (amount <= 0 || amount > makeNumber(order.totalAmount)) {
      throw new Error("Refund amount is invalid");
    }
    if (!reason?.trim()) throw new Error("Refund reason is required");

    const refunded = await Refund.sum("amount", {
      where: {
        orderId: id,
        status: { [Op.in]: [RefundStatus.APPROVED, RefundStatus.COMPLETED] }
      }
    });
    if (makeNumber(refunded) + amount > makeNumber(order.totalAmount)) {
      throw new Error("Refund exceeds the remaining refundable amount");
    }

    return Refund.create({
      orderId: id,
      amount,
      reason,
      status: RefundStatus.PENDING,
      createdBy: actorId
    });
  }

  async updateRefundStatus(refundId: string, status: RefundStatus) {
    if (!Object.values(RefundStatus).includes(status)) {
      throw new Error("Invalid refund status");
    }
    const refund = await Refund.findByPk(refundId);
    if (!refund) throw new Error("Refund not found");
    await refund.update({ status });

    if (status === RefundStatus.COMPLETED) {
      const order = await Order.findByPk(refund.orderId);
      if (order) {
        const completed = makeNumber(
          await Refund.sum("amount", {
            where: { orderId: order.id, status: RefundStatus.COMPLETED }
          })
        );
        await order.update({
          paymentStatus:
            completed >= makeNumber(order.totalAmount)
              ? PaymentStatus.REFUNDED
              : PaymentStatus.PARTIALLY_REFUNDED
        });
      }
    }
    return refund;
  }
}
