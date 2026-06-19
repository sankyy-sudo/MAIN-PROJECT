import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

const service = new CategoryService();

const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;

export class CategoryController {
  async createCategory(
    req: Request,
    res: Response
  ) {
    const category =
      await service.createCategory(req.body);

    return res.status(201).json({
      success: true,
      data: category
    });
  }

  async getCategories(
    _req: Request,
    res: Response
  ) {
    const categories =
      await service.getCategories();

    return res.json({
      success: true,
      data: categories
    });
  }

  async updateCategory(
    req: Request,
    res: Response
  ) {
    const category =
      await service.updateCategory(
        getParamId(req.params.id),
        req.body
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
      success: true,
      data: category
    });
  }

  async deleteCategory(
    req: Request,
    res: Response
  ) {
    const category =
      await service.deleteCategory(
        getParamId(req.params.id)
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    return res.json({
      success: true,
      message: "Category deleted successfully"
    });
  }
}

export const categoryController =
  new CategoryController();
