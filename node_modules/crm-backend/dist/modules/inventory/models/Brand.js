"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
class Brand extends sequelize_1.Model {
}
exports.Brand = Brand;
Brand.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    description: sequelize_1.DataTypes.TEXT,
    logoUrl: sequelize_1.DataTypes.STRING,
    isActive: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "brands" });
