import { Op, WhereOptions } from "sequelize";
import { sequelize } from "../../../config/database";
import { User } from "../../../models/User";
import { BusinessAccount } from "../../b2b/models/BusinessAccount";
import { Cart } from "../../cart/models/Cart";
import { CartItem as ShoppingCartItem } from "../../cart/models/CartItem";
import { CommerceService } from "../../commerce/services/commerce.service";
import { Customer } from "../../crm/models/Customer";
import {
  InventoryMovement,
  InventoryMovementType
} from "../../inventory/models/InventoryMovement";
import { Product } from "../../inventory/models/Product";
import { Invoice } from "../models/Invoice";
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "../models/Order";
import { OrderEvent } from "../models/OrderEvent";
import { OrderItem } from "../models/OrderItem";
import { Refund, RefundStatus } from "../models/Refund";
import { emailTemplates, sendTemplateEmail } from "../../../utils/email";

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
  couponCode?: string;
  paymentMethod?: PaymentMethod;
  shippingAddress: string;
  notes?: string;
  createdBy: string;
}

interface OrderQuery {
  search?: string;
  status?: OrderStatus;
  page: number;
  limit: number;
  createdBy?: string;
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
const commerceService = new CommerceService();

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    if (!input.items?.length) throw new Error("Order requires at least one item");
    if (!input.shippingAddress?.trim()) throw new Error("Shipping address is required");

    const createdOrder = await sequelize.transaction(async (transaction) => {
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
        const availableToSell =
          product.stockQuantity + (product.allowPreOrder ? product.preOrderLimit : 0);
        if (availableToSell < item.quantity) {
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

      const quote = await commerceService.quote({
        items: lineItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        couponCode: input.couponCode
      });
      const subtotal = quote.subtotal;
      const discountAmount =
        input.discountAmount === undefined
          ? quote.discountAmount
          : Math.max(makeNumber(input.discountAmount), 0);
      const taxAmount =
        input.taxAmount === undefined
          ? quote.taxAmount
          : Math.max(makeNumber(input.taxAmount), 0);
      const shippingAmount =
        input.shippingAmount === undefined
          ? quote.shippingAmount
          : Math.max(makeNumber(input.shippingAmount), 0);
      const totalAmount = Math.max(subtotal - discountAmount + taxAmount + shippingAmount, 0);

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
          couponCode: input.couponCode?.trim().toUpperCase(),
          paymentMethod: input.paymentMethod || PaymentMethod.STRIPE,
          shippingAddress: input.shippingAddress,
          notes: input.notes,
          createdBy: input.createdBy
        },
        { transaction }
      );

      for (const item of lineItems) {
        const previousQuantity = item.product.stockQuantity;
        const newQuantity = Math.max(previousQuantity - item.quantity, 0);

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

      await commerceService.incrementCouponUsage(input.couponCode);

      return this.getOrderById(order.id, transaction);
    });

    if (createdOrder) {
      const value = createdOrder.toJSON() as any;
      const recipient =
        value.customer?.email ||
        value.businessAccount?.email ||
        value.creator?.email;
      if (recipient) {
        await sendTemplateEmail(
          recipient,
          emailTemplates.orderConfirmation(
            value,
            value.items || [],
            value.customer?.contactPerson ||
              value.businessAccount?.contactPerson ||
              "Customer"
          )
        );
      }
    }
    return createdOrder;
  }

  async createOrderFromCart(input: {
    customerUserId: string;
    shippingAddress: string;
    notes?: string;
    couponCode?: string;
    paymentMethod?: PaymentMethod;
    discountAmount?: number;
    taxAmount?: number;
    shippingAmount?: number;
  }) {
    const user = await User.findByPk(input.customerUserId);
    const cart = await Cart.findOne({
      where: { customerId: input.customerUserId },
      include: [{ model: ShoppingCartItem, as: "items" }]
    });

    const items = ((cart as any)?.items || []) as ShoppingCartItem[];
    if (!cart || items.length === 0) {
      throw new Error("Cart is empty");
    }

    const order = await this.createOrder({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice)
      })),
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      couponCode: input.couponCode,
      paymentMethod: input.paymentMethod,
      discountAmount: input.discountAmount,
      taxAmount: input.taxAmount,
      shippingAmount: input.shippingAmount,
      businessAccountId: user?.businessAccountId || undefined,
      createdBy: input.customerUserId
    });

    await ShoppingCartItem.destroy({ where: { cartId: cart.id } });
    return order;
  }

  async createBusinessBulkOrder(input: {
    customerUserId: string;
    items: CreateOrderItem[];
    shippingAddress: string;
    notes?: string;
    paymentMethod?: PaymentMethod;
  }) {
    const user = await User.findByPk(input.customerUserId);
    if (!user?.businessAccountId) {
      throw new Error("Professional access is required for bulk orders");
    }

    const account = await BusinessAccount.findByPk(user.businessAccountId);
    if (!account) throw new Error("Business account not found");
    if (!account.bulkOrdersEnabled) {
      throw new Error("Bulk ordering is not enabled for this account");
    }

    const items = await Promise.all(
      input.items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        if (!product || !product.isActive) {
          throw new Error("Product not found or inactive");
        }

        const customPrice = account.customPricing?.find(
          (price) => price.sku === product.sku
        );
        const wholesalePrice = Number(product.wholesalePrice);
        const discount = Number(account.discountPercentage || 0);

        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: customPrice
            ? Number(customPrice.price)
            : Math.max(wholesalePrice - (wholesalePrice * discount) / 100, 0)
        };
      })
    );

    return this.createOrder({
      items,
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      paymentMethod: input.paymentMethod,
      businessAccountId: account.id,
      createdBy: input.customerUserId
    });
  }

  async getOrders(query: OrderQuery) {
    const where: WhereOptions = {};
    if (query.status) Object.assign(where, { status: query.status });
    if (query.createdBy) Object.assign(where, { createdBy: query.createdBy });
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

  async getCustomerOrders(customerUserId: string, page: number, limit: number) {
    return this.getOrders({ createdBy: customerUserId, page, limit });
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

    const updatedOrder = await sequelize.transaction(async (transaction) => {
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

    if (status === OrderStatus.SHIPPED) {
      const order = await this.getOrderById(id);
      if (order) {
        const value = order.toJSON() as any;
        const recipient =
          value.customer?.email ||
          value.businessAccount?.email ||
          value.creator?.email;
        if (recipient) {
          await sendTemplateEmail(
            recipient,
            emailTemplates.orderShipped(value, location)
          );
        }
      }
    }
    return updatedOrder;
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

  renderInvoiceDocument(invoice: Invoice) {
    const value = invoice.toJSON() as any;
    const order = value.order || {};
    const items = order.items || [];
    const content = [
      `Invoice: ${value.invoiceNumber}`,
      `Order: ${order.orderNumber || value.orderId}`,
      `Issued: ${new Date(value.issuedAt).toLocaleDateString()}`,
      `Status: ${order.status || "PENDING"}`,
      "",
      "Items",
      ...items.map(
        (item: any) =>
          `${item.productName} (${item.sku}) x ${item.quantity} = ${item.lineTotal}`
      ),
      "",
      `Subtotal: ${order.subtotal || 0}`,
      `Discount: ${order.discountAmount || 0}`,
      `Tax: ${order.taxAmount || 0}`,
      `Shipping: ${order.shippingAmount || 0}`,
      `Total: ${value.amount}`
    ].join("\n");

    return {
      fileName: `${value.invoiceNumber}.txt`,
      content
    };
  }

  renderPackingSlip(order: Order) {
    const value = order.toJSON() as any;
    const items = value.items || [];
    const content = [
      `Packing Slip: ${value.orderNumber}`,
      `Ship to: ${value.shippingAddress}`,
      `Status: ${value.status}`,
      "",
      "Items",
      ...items.map(
        (item: any) => `${item.productName} (${item.sku}) x ${item.quantity}`
      ),
      "",
      `Notes: ${value.notes || ""}`
    ].join("\n");

    return {
      fileName: `${value.orderNumber}-packing-slip.txt`,
      content
    };
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
