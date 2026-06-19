import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";

const service = new BrandService();

const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;

export class BrandController {
  async createBrand(
    req: Request,
    res: Response
  ) {
    const brand =
      await service.createBrand(req.body);

    return res.status(201).json({
      success: true,
      data: brand
    });
  }

  async getBrands(
    _req: Request,
    res: Response
  ) {
    const brands = await service.getBrands();

    return res.json({
      success: true,
      data: brands
    });
  }

  async updateBrand(
    req: Request,
    res: Response
  ) {
    const brand =
      await service.updateBrand(
        getParamId(req.params.id),
        req.body
      );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found"
      });
    }

    return res.json({
      success: true,
      data: brand
    });
  }

  async deleteBrand(
    req: Request,
    res: Response
  ) {
    const brand =
      await service.deleteBrand(
        getParamId(req.params.id)
      );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found"
      });
    }

    return res.json({
      success: true,
      message: "Brand deleted successfully"
    });
  }
}

export const brandController =
  new BrandController();
