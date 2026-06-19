"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const service = new order_service_1.OrderService();
const param = (value) => Array.isArray(value) ? value[0] : value;
class OrderController {
    async create(req, res) {
        try {
            const data = await service.createOrder({ ...req.body, createdBy: req.user.id });
            return res.status(201).json({ success: true, message: "Order created", data });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async list(req, res) {
        const data = await service.getOrders({
            search: req.query.search,
            status: req.query.status,
            page: Math.max(Number(req.query.page) || 1, 1),
            limit: Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
        });
        return res.json({ success: true, data });
    }
    async get(req, res) {
        const data = await service.getOrderById(param(req.params.id));
        return data
            ? res.json({ success: true, data })
            : res.status(404).json({ success: false, message: "Order not found" });
    }
    async status(req, res) {
        try {
            const data = await service.updateStatus(param(req.params.id), req.body.status, req.user.id, req.body.message, req.body.location);
            return res.json({ success: true, message: "Order status updated", data });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async tracking(req, res) {
        try {
            const data = await service.getTracking(param(req.params.id));
            return res.json({ success: true, data });
        }
        catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }
    async invoice(req, res) {
        try {
            const data = await service.getInvoice(param(req.params.id));
            return res.json({ success: true, data });
        }
        catch (error) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }
    async refund(req, res) {
        try {
            const data = await service.createRefund(param(req.params.id), Number(req.body.amount), req.body.reason, req.user.id);
            return res.status(201).json({ success: true, message: "Refund requested", data });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async refundStatus(req, res) {
        try {
            const data = await service.updateRefundStatus(param(req.params.refundId), req.body.status);
            return res.json({ success: true, message: "Refund status updated", data });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
exports.OrderController = OrderController;
exports.orderController = new OrderController();
