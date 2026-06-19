"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const sequelize_1 = require("sequelize");
const Brand_1 = require("../models/Brand");
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
const productIncludes = [
    { model: Category_1.Category, as: "categoryDetails" },
    { model: Brand_1.Brand, as: "brandDetails" }
];
const serializeProduct = (product) => {
    const value = product.toJSON();
    value.category = value.categoryDetails;
    value.brand = value.brandDetails;
    delete value.categoryDetails;
    delete value.brandDetails;
    return value;
};
class ProductService {
    async createProduct(data) {
        const product = await Product_1.Product.create(data);
        return this.getProductById(product.id);
    }
    async getProducts(page, limit, query = {}) {
        const where = {};
        if (query.search) {
            Object.assign(where, {
                [sequelize_1.Op.or]: [
                    { name: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { sku: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { description: { [sequelize_1.Op.iLike]: `%${query.search}%` } }
                ]
            });
        }
        if (query.category)
            Object.assign(where, { category: query.category });
        if (query.brand)
            Object.assign(where, { brand: query.brand });
        if (typeof query.isActive === "boolean") {
            Object.assign(where, { isActive: query.isActive });
        }
        const { rows, count } = await Product_1.Product.findAndCountAll({
            where,
            include: productIncludes,
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * limit,
            limit
        });
        return { products: rows.map(serializeProduct), total: count, page, limit };
    }
    async getProductById(id) {
        const product = await Product_1.Product.findByPk(id, { include: productIncludes });
        return product ? serializeProduct(product) : null;
    }
    async updateProduct(id, data) {
        const product = await Product_1.Product.findByPk(id);
        if (!product)
            return null;
        await product.update(data);
        return this.getProductById(id);
    }
    async deleteProduct(id) {
        const product = await Product_1.Product.findByPk(id);
        if (!product)
            return null;
        await product.destroy();
        return product;
    }
}
exports.ProductService = ProductService;
