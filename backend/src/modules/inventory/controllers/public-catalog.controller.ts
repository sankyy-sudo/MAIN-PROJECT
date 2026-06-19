import { Request, Response } from "express";
import { PublicCatalogService } from "../services/public-catalog.service";

const service = new PublicCatalogService();
const param = (value: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export class PublicCatalogController {
  async products(req: Request, res: Response) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
    const inStock =
      typeof req.query.inStock === "string"
        ? req.query.inStock === "true"
        : undefined;

    const data = await service.getProducts(
      {
        page,
        limit,
        category: req.query.category as string | undefined,
        brand: req.query.brand as string | undefined,
        search: req.query.search as string | undefined,
        minPrice:
          req.query.minPrice === undefined
            ? undefined
            : Number(req.query.minPrice),
        maxPrice:
          req.query.maxPrice === undefined
            ? undefined
            : Number(req.query.maxPrice),
        inStock
      },
      req.user
    );

    return res.json({ success: true, data });
  }

  async product(req: Request, res: Response) {
    const data = await service.getProductById(param(req.params.id), req.user);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    return res.json({ success: true, data });
  }

  async categories(_req: Request, res: Response) {
    return res.json({
      success: true,
      data: await service.getCategories()
    });
  }

  async brands(_req: Request, res: Response) {
    return res.json({
      success: true,
      data: await service.getBrands()
    });
  }
}

export const publicCatalogController = new PublicCatalogController();
