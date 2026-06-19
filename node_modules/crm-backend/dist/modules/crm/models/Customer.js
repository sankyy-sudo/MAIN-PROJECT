"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
Customer.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    companyName: sequelize_1.DataTypes.STRING,
    contactPerson: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    phone: sequelize_1.DataTypes.STRING,
    address: sequelize_1.DataTypes.TEXT,
    notes: sequelize_1.DataTypes.TEXT,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "customers" });
