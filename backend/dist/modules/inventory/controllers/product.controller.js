"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const service = new product_service_1.ProductService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class ProductController {
    async createProduct(req, res) {
        const product = await service.createProduct(req.body);
        return res.status(201).json({
            success: true,
            data: product
        });
    }
    async getProducts(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const isActive = typeof req.query.isActive === "string"
            ? req.query.isActive === "true"
            : undefined;
        const result = await service.getProducts(page, limit, {
            search: req.query.search,
            category: req.query.category,
            brand: req.query.brand,
            isActive
        });
        return res.json({
            success: true,
            data: result
        });
    }
    async getProductById(req, res) {
        const product = await service.getProductById(getParamId(req.params.id));
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
    async updateProduct(req, res) {
        const product = await service.updateProduct(getParamId(req.params.id), req.body);
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
    async deleteProduct(req, res) {
        const product = await service.deleteProduct(getParamId(req.params.id));
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
exports.ProductController = ProductController;
exports.productController = new ProductController();
