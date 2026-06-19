"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const User_1 = require("../models/User");
const Lead_1 = require("../modules/crm/models/Lead");
const Customer_1 = require("../modules/crm/models/Customer");
const Order_1 = require("../modules/orders/models/Order");
const sequelize_1 = require("sequelize");
class DashboardController {
    async getStats(req, res) {
        try {
            const totalUsers = await User_1.User.count();
            const totalCustomers = await Customer_1.Customer.count();
            const totalLeads = await Lead_1.Lead.count();
            const totalOrders = await Order_1.Order.count();
            const revenueResult = await Order_1.Order.findOne({
                attributes: [[(0, sequelize_1.fn)("COALESCE", (0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("totalAmount")), 0), "revenue"]],
                where: { status: Order_1.OrderStatus.DELIVERED },
                raw: true
            });
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
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
