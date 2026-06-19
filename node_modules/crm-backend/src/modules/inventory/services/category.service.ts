import { Category, ICategory } from "../models/Category";

export class CategoryService {
  async createCategory(data: Partial<ICategory>) {
    return Category.create(data as any);
  }

  async getCategories() {
    return Category.findAll({ order: [["name", "ASC"]] });
  }

  async updateCategory(id: string, data: Partial<ICategory>) {
    const category = await Category.findByPk(id);
    return category ? category.update(data) : null;
  }

  async deleteCategory(id: string) {
    const category = await Category.findByPk(id);
    if (!category) return null;
    await category.destroy();
    return category;
  }
}
