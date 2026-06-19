"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandController = exports.BrandController = void 0;
const brand_service_1 = require("../services/brand.service");
const service = new brand_service_1.BrandService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class BrandController {
    async createBrand(req, res) {
        const brand = await service.createBrand(req.body);
        return res.status(201).json({
            success: true,
            data: brand
        });
    }
    async getBrands(_req, res) {
        const brands = await service.getBrands();
        return res.json({
            success: true,
            data: brands
        });
    }
    async updateBrand(req, res) {
        const brand = await service.updateBrand(getParamId(req.params.id), req.body);
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
    async deleteBrand(req, res) {
        const brand = await service.deleteBrand(getParamId(req.params.id));
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
exports.BrandController = BrandController;
exports.brandController = new BrandController();
