"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    sku: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue("sku", value.trim().toUpperCase());
        }
    },
    description: sequelize_1.DataTypes.TEXT,
    images: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING), allowNull: false, defaultValue: [] },
    category: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    brand: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    retailPrice: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    wholesalePrice: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    stockQuantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    allowPreOrder: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    preOrderLimit: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    isActive: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "products" });
