import { Request, Response } from "express";
import { InventoryMovementType } from "../models/InventoryMovement";
import { InventoryService } from "../services/inventory.service";

const service = new InventoryService();
const getParam = (value: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export class InventoryController {
  async createMovement(req: Request, res: Response) {
    try {
      const movement = await service.recordMovement({
        productId: req.body.productId,
        type: req.body.type as InventoryMovementType,
        quantity: Number(req.body.quantity),
        reason: req.body.reason,
        reference: req.body.reference,
        createdBy: req.user!.id
      });

      return res.status(201).json({
        success: true,
        message: "Stock movement recorded",
        data: movement
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getMovements(req: Request, res: Response) {
    const data = await service.getMovements({
      productId: req.query.productId as string | undefined,
      type: req.query.type as InventoryMovementType | undefined,
      page: Math.max(Number(req.query.page) || 1, 1),
      limit: Math.min(Math.max(Number(req.query.limit) || 20, 1), 100)
    });

    return res.json({ success: true, data });
  }

  async getLowStock(req: Request, res: Response) {
    const data = await service.getLowStockProducts(
      req.query.search as string | undefined
    );
    return res.json({ success: true, data });
  }

  async updateThreshold(req: Request, res: Response) {
    try {
      const data = await service.updateThreshold(
        getParam(req.params.productId),
        Number(req.body.lowStockThreshold)
      );
      return res.json({
        success: true,
        message: "Low stock threshold updated",
        data
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const inventoryController = new InventoryController();
