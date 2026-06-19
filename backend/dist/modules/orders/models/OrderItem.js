"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
class OrderItem extends sequelize_1.Model {
}
exports.OrderItem = OrderItem;
OrderItem.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    orderId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    productId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    productName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    sku: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    unitPrice: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    lineTotal: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "order_items" });
