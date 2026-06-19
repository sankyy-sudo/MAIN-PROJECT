import { Brand, IBrand } from "../models/Brand";

export class BrandService {
  async createBrand(data: Partial<IBrand>) {
    return Brand.create(data as any);
  }

  async getBrands() {
    return Brand.findAll({ order: [["name", "ASC"]] });
  }

  async updateBrand(id: string, data: Partial<IBrand>) {
    const brand = await Brand.findByPk(id);
    return brand ? brand.update(data) : null;
  }

  async deleteBrand(id: string) {
    const brand = await Brand.findByPk(id);
    if (!brand) return null;
    await brand.destroy();
    return brand;
  }
}
