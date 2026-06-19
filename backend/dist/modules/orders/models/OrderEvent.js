"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEvent = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
const Order_1 = require("./Order");
class OrderEvent extends sequelize_1.Model {
}
exports.OrderEvent = OrderEvent;
OrderEvent.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    orderId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(Order_1.OrderStatus)),
        allowNull: false
    },
    message: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    location: sequelize_1.DataTypes.STRING,
    createdBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "order_events" });
