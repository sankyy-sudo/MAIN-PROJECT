"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
class Invoice extends sequelize_1.Model {
}
exports.Invoice = Invoice;
Invoice.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    orderId: { type: sequelize_1.DataTypes.UUID, allowNull: false, unique: true },
    invoiceNumber: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    issuedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
    dueAt: sequelize_1.DataTypes.DATE,
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "invoices" });
