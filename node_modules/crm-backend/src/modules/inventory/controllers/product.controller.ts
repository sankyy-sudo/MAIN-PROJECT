import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

const service = new ProductService();

const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;

export class ProductController {
  async createProduct(
    req: Request,
    res: Response
  ) {
    const product =
      await service.createProduct(req.body);

    return res.status(201).json({
      success: true,
      data: product
    });
  }

  async getProducts(
    req: Request,
    res: Response
  ) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const isActive =
      typeof req.query.isActive === "string"
        ? req.query.isActive === "true"
        : undefined;

    const result = await service.getProducts(
      page,
      limit,
      {
        search:
          req.query.search as string | undefined,
        category:
          req.query.category as string | undefined,
        brand:
          req.query.brand as string | undefined,
        isActive
      }
    );

    return res.json({
      success: true,
      data: result
    });
  }

  async getProductById(
    req: Request,
    res: Response
  ) {
    const product =
      await service.getProductById(
        getParamId(req.params.id)
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json({
      success: true,
      data: product
    });
  }

  async updateProduct(
    req: Request,
    res: Response
  ) {
    const product =
      await service.updateProduct(
        getParamId(req.params.id),
        req.body
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json({
      success: true,
      data: product
    });
  }

  async deleteProduct(
    req: Request,
    res: Response
  ) {
    const product =
      await service.deleteProduct(
        getParamId(req.params.id)
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully"
    });
  }
}

export const productController =
  new ProductController();
