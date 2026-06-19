"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
const service = new category_service_1.CategoryService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class CategoryController {
    async createCategory(req, res) {
        const category = await service.createCategory(req.body);
        return res.status(201).json({
            success: true,
            data: category
        });
    }
    async getCategories(_req, res) {
        const categories = await service.getCategories();
        return res.json({
            success: true,
            data: categories
        });
    }
    async updateCategory(req, res) {
        const category = await service.updateCategory(getParamId(req.params.id), req.body);
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
    async deleteCategory(req, res) {
        const category = await service.deleteCategory(getParamId(req.params.id));
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
exports.CategoryController = CategoryController;
exports.categoryController = new CategoryController();
