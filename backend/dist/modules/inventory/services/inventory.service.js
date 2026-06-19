"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
const User_1 = require("../../../models/User");
const Product_1 = require("../models/Product");
const InventoryMovement_1 = require("../models/InventoryMovement");
const InventorySetting_1 = require("../models/InventorySetting");
const email_1 = require("../../../utils/email");
const movementIncludes = [
    {
        model: Product_1.Product,
        as: "productDetails",
        attributes: ["id", "name", "sku", "stockQuantity"]
    },
    {
        model: User_1.User,
        as: "actor",
        attributes: ["id", "name", "email", "role"]
    }
];
class InventoryService {
    async recordMovement(input) {
        if (!Object.values(InventoryMovement_1.InventoryMovementType).includes(input.type)) {
            throw new Error("Invalid inventory movement type");
        }
        if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
            throw new Error("Quantity must be a positive whole number");
        }
        if (!input.reason?.trim()) {
            throw new Error("A reason is required for every stock movement");
        }
        const result = await database_1.sequelize.transaction(async (transaction) => {
            const product = await Product_1.Product.findByPk(input.productId, {
                transaction,
                lock: transaction.LOCK.UPDATE
            });
            if (!product) {
                throw new Error("Product not found");
            }
            const previousQuantity = product.stockQuantity;
            const addsStock = input.type === InventoryMovement_1.InventoryMovementType.STOCK_IN ||
                input.type === InventoryMovement_1.InventoryMovementType.RETURN;
            const newQuantity = addsStock
                ? previousQuantity + input.quantity
                : previousQuantity - input.quantity;
            if (newQuantity < 0) {
                throw new Error("Insufficient stock for this movement");
            }
            await product.update({ stockQuantity: newQuantity }, { transaction });
            const movement = await InventoryMovement_1.InventoryMovement.create({
                ...input,
                previousQuantity,
                newQuantity
            }, { transaction });
            await InventorySetting_1.InventorySetting.findOrCreate({
                where: { productId: product.id },
                defaults: { productId: product.id },
                transaction
            });
            return movement;
        });
        const setting = await InventorySetting_1.InventorySetting.findOne({
            where: { productId: input.productId }
        });
        if (setting &&
            result.newQuantity <= setting.lowStockThreshold) {
            const product = await Product_1.Product.findByPk(input.productId);
            const managers = await User_1.User.findAll({
                where: {
                    role: User_1.UserRole.INVENTORY_MANAGER,
                    status: User_1.UserStatus.ACTIVE
                },
                attributes: ["email"]
            });
            if (product && managers.length) {
                await (0, email_1.sendTemplateEmail)(managers.map((manager) => manager.email), email_1.emailTemplates.lowStockAlert(product, result.newQuantity, setting.lowStockThreshold));
            }
        }
        return result;
    }
    async getMovements(query) {
        const where = {};
        if (query.productId)
            Object.assign(where, { productId: query.productId });
        if (query.type)
            Object.assign(where, { type: query.type });
        const { rows, count } = await InventoryMovement_1.InventoryMovement.findAndCountAll({
            where,
            include: movementIncludes,
            order: [["createdAt", "DESC"]],
            offset: (query.page - 1) * query.limit,
            limit: query.limit
        });
        return {
            movements: rows,
            total: count,
            page: query.page,
            limit: query.limit
        };
    }
    async getLowStockProducts(search) {
        const products = await Product_1.Product.findAll({
            where: {
                isActive: true,
                ...(search
                    ? {
                        [sequelize_1.Op.or]: [
                            { name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                            { sku: { [sequelize_1.Op.iLike]: `%${search}%` } }
                        ]
                    }
                    : {})
            },
            include: [
                {
                    model: InventorySetting_1.InventorySetting,
                    as: "inventorySetting",
                    required: false
                }
            ],
            order: [["stockQuantity", "ASC"]]
        });
        return products
            .map((product) => {
            const value = product.toJSON();
            const threshold = value.inventorySetting?.lowStockThreshold ?? 10;
            return {
                ...value,
                lowStockThreshold: threshold,
                isLowStock: product.stockQuantity <= threshold
            };
        })
            .filter((product) => product.isLowStock);
    }
    async updateThreshold(productId, lowStockThreshold) {
        if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
            throw new Error("Low stock threshold must be a non-negative whole number");
        }
        if (!(await Product_1.Product.findByPk(productId))) {
            throw new Error("Product not found");
        }
        const [setting] = await InventorySetting_1.InventorySetting.findOrCreate({
            where: { productId },
            defaults: { productId, lowStockThreshold }
        });
        if (setting.lowStockThreshold !== lowStockThreshold) {
            await setting.update({ lowStockThreshold });
        }
        return setting;
    }
}
exports.InventoryService = InventoryService;
