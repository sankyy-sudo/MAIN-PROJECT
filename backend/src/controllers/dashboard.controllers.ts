import { Request, Response } from "express";
import { User } from "../models/User";
import { Lead } from "../modules/crm/models/Lead";
import { Customer } from "../modules/crm/models/Customer";
import { Order, OrderStatus } from "../modules/orders/models/Order";
import { fn, col } from "sequelize";

export class DashboardController {
  async getStats(
    req: Request,
    res: Response
  ) {
    try {
      const totalUsers =
        await User.count();

      const totalCustomers =
        await Customer.count();
      const totalLeads =
        await Lead.count();
      const totalOrders = await Order.count();
      const revenueResult = await Order.findOne({
        attributes: [[fn("COALESCE", fn("SUM", col("totalAmount")), 0), "revenue"]],
        where: { status: OrderStatus.DELIVERED },
        raw: true
      }) as any;
      const revenue = Number(revenueResult?.revenue || 0);

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalCustomers,
          totalLeads,
          totalOrders,
          revenue
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const dashboardController =
  new DashboardController();
