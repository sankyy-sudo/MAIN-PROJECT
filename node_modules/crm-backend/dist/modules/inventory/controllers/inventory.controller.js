"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryController = exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
const service = new inventory_service_1.InventoryService();
const getParam = (value) => Array.isArray(value) ? value[0] : value;
class InventoryController {
    async createMovement(req, res) {
        try {
            const movement = await service.recordMovement({
                productId: req.body.productId,
                type: req.body.type,
                quantity: Number(req.body.quantity),
                reason: req.body.reason,
                reference: req.body.reference,
                createdBy: req.user.id
            });
            return res.status(201).json({
                success: true,
                message: "Stock movement recorded",
                data: movement
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async getMovements(req, res) {
        const data = await service.getMovements({
            productId: req.query.productId,
            type: req.query.type,
            page: Math.max(Number(req.query.page) || 1, 1),
            limit: Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
        });
        return res.json({ success: true, data });
    }
    async getLowStock(req, res) {
        const data = await service.getLowStockProducts(req.query.search);
        return res.json({ success: true, data });
    }
    async updateThreshold(req, res) {
        try {
            const data = await service.updateThreshold(getParam(req.params.productId), Number(req.body.lowStockThreshold));
            return res.json({
                success: true,
                message: "Low stock threshold updated",
                data
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
exports.InventoryController = InventoryController;
exports.inventoryController = new InventoryController();
