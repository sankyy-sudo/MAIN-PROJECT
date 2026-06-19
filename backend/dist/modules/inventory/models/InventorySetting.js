"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventorySetting = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
class InventorySetting extends sequelize_1.Model {
}
exports.InventorySetting = InventorySetting;
InventorySetting.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    _id: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.id;
        }
    },
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    lowStockThreshold: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        validate: { min: 0 }
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "inventory_settings" });
