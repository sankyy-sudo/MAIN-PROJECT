"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const Category_1 = require("../models/Category");
class CategoryService {
    async createCategory(data) {
        return Category_1.Category.create(data);
    }
    async getCategories() {
        return Category_1.Category.findAll({ order: [["name", "ASC"]] });
    }
    async updateCategory(id, data) {
        const category = await Category_1.Category.findByPk(id);
        return category ? category.update(data) : null;
    }
    async deleteCategory(id) {
        const category = await Category_1.Category.findByPk(id);
        if (!category)
            return null;
        await category.destroy();
        return category;
    }
}
exports.CategoryService = CategoryService;
