import { col, fn, literal, Op } from "sequelize";
import { Customer } from "../../crm/models/Customer";
import { Lead, LeadStatus } from "../../crm/models/Lead";
import { Order, OrderStatus, PaymentStatus } from "../../orders/models/Order";
import { OrderItem } from "../../orders/models/OrderItem";

const numberValue = (value: unknown) => Number(value || 0);

export class AnalyticsService {
  async revenueAnalytics() {
    const deliveredRevenue = await Order.sum("totalAmount", {
      where: { status: OrderStatus.DELIVERED }
    });
    const paidRevenue = await Order.sum("totalAmount", {
      where: { paymentStatus: PaymentStatus.PAID }
    });
    const monthly = await Order.findAll({
      attributes: [
        [fn("date_trunc", "month", col("createdAt")), "period"],
        [fn("COUNT", col("id")), "orders"],
        [fn("COALESCE", fn("SUM", col("totalAmount")), 0), "revenue"]
      ],
      group: [fn("date_trunc", "month", col("createdAt"))],
      order: [[fn("date_trunc", "month", col("createdAt")), "ASC"]],
      raw: true
    }) as any[];

    return {
      deliveredRevenue: numberValue(deliveredRevenue),
      paidRevenue: numberValue(paidRevenue),
      monthly: monthly.map((row) => ({
        period: new Date(row.period).toISOString().slice(0, 7),
        orders: numberValue(row.orders),
        revenue: numberValue(row.revenue)
      }))
    };
  }

  async topProducts(limit = 10) {
    const rows = await OrderItem.findAll({
      attributes: [
        "productId",
        "productName",
        "sku",
        [fn("SUM", col("quantity")), "unitsSold"],
        [fn("COALESCE", fn("SUM", col("lineTotal")), 0), "revenue"]
      ],
      group: ["productId", "productName", "sku"],
      order: [[literal('"revenue"'), "DESC"]],
      limit,
      raw: true
    }) as any[];

    return rows.map((row) => ({
      productId: row.productId,
      productName: row.productName,
      sku: row.sku,
      unitsSold: numberValue(row.unitsSold),
      revenue: numberValue(row.revenue)
    }));
  }

  async conversionRates() {
    const totalLeads = await Lead.count();
    const wonLeads = await Lead.count({ where: { status: LeadStatus.WON } });
    const lostLeads = await Lead.count({ where: { status: LeadStatus.LOST } });
    const cartsCreated = 0;
    const totalOrders = await Order.count();

    return {
      leadWinRate: totalLeads ? Number(((wonLeads / totalLeads) * 100).toFixed(2)) : 0,
      leadLossRate: totalLeads ? Number(((lostLeads / totalLeads) * 100).toFixed(2)) : 0,
      orderConversionProxy: totalLeads
        ? Number(((totalOrders / totalLeads) * 100).toFixed(2))
        : 0,
      totalLeads,
      wonLeads,
      lostLeads,
      cartsCreated,
      totalOrders
    };
  }

  async customerAnalytics() {
    const totalCustomers = await Customer.count();
    const newCustomers30d = await Customer.count({
      where: { createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    });
    const monthly = await Customer.findAll({
      attributes: [
        [fn("date_trunc", "month", col("createdAt")), "period"],
        [fn("COUNT", col("id")), "customers"]
      ],
      group: [fn("date_trunc", "month", col("createdAt"))],
      order: [[fn("date_trunc", "month", col("createdAt")), "ASC"]],
      raw: true
    }) as any[];

    return {
      totalCustomers,
      newCustomers30d,
      monthly: monthly.map((row) => ({
        period: new Date(row.period).toISOString().slice(0, 7),
        customers: numberValue(row.customers)
      }))
    };
  }

  async salesAnalytics() {
    const byStatus = await Order.findAll({
      attributes: [
        "status",
        [fn("COUNT", col("id")), "orders"],
        [fn("COALESCE", fn("SUM", col("totalAmount")), 0), "revenue"]
      ],
      group: ["status"],
      raw: true
    }) as any[];
    const byPaymentStatus = await Order.findAll({
      attributes: [
        "paymentStatus",
        [fn("COUNT", col("id")), "orders"],
        [fn("COALESCE", fn("SUM", col("totalAmount")), 0), "revenue"]
      ],
      group: ["paymentStatus"],
      raw: true
    }) as any[];

    return {
      byStatus: byStatus.map((row) => ({
        status: row.status,
        orders: numberValue(row.orders),
        revenue: numberValue(row.revenue)
      })),
      byPaymentStatus: byPaymentStatus.map((row) => ({
        status: row.paymentStatus,
        orders: numberValue(row.orders),
        revenue: numberValue(row.revenue)
      }))
    };
  }

  async leadConversionAnalytics() {
    const byStatus = await Lead.findAll({
      attributes: ["status", [fn("COUNT", col("id")), "count"]],
      group: ["status"],
      raw: true
    }) as any[];
    const bySource = await Lead.findAll({
      attributes: [
        [fn("COALESCE", col("source"), "Unknown"), "source"],
        [fn("COUNT", col("id")), "count"]
      ],
      group: [fn("COALESCE", col("source"), "Unknown")],
      raw: true
    }) as any[];

    return {
      byStatus: byStatus.map((row) => ({
        status: row.status,
        count: numberValue(row.count)
      })),
      bySource: bySource.map((row) => ({
        source: row.source,
        count: numberValue(row.count)
      }))
    };
  }

  async summary() {
    const [
      revenue,
      topProducts,
      conversion,
      customers,
      sales,
      leads
    ] = await Promise.all([
      this.revenueAnalytics(),
      this.topProducts(5),
      this.conversionRates(),
      this.customerAnalytics(),
      this.salesAnalytics(),
      this.leadConversionAnalytics()
    ]);

    return { revenue, topProducts, conversion, customers, sales, leads };
  }
}
