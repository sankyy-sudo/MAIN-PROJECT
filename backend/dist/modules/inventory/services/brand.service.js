"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const Brand_1 = require("../models/Brand");
class BrandService {
    async createBrand(data) {
        return Brand_1.Brand.create(data);
    }
    async getBrands() {
        return Brand_1.Brand.findAll({ order: [["name", "ASC"]] });
    }
    async updateBrand(id, data) {
        const brand = await Brand_1.Brand.findByPk(id);
        return brand ? brand.update(data) : null;
    }
    async deleteBrand(id) {
        const brand = await Brand_1.Brand.findByPk(id);
        if (!brand)
            return null;
        await brand.destroy();
        return brand;
    }
}
exports.BrandService = BrandService;
