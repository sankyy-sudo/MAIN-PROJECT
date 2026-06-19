"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMovement = exports.InventoryMovementType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var InventoryMovementType;
(function (InventoryMovementType) {
    InventoryMovementType["STOCK_IN"] = "STOCK_IN";
    InventoryMovementType["STOCK_OUT"] = "STOCK_OUT";
    InventoryMovementType["ADJUSTMENT"] = "ADJUSTMENT";
    InventoryMovementType["RETURN"] = "RETURN";
})(InventoryMovementType || (exports.InventoryMovementType = InventoryMovementType = {}));
class InventoryMovement extends sequelize_1.Model {
}
exports.InventoryMovement = InventoryMovement;
InventoryMovement.init({
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
    productId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(InventoryMovementType)),
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1 }
    },
    previousQuantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    newQuantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 }
    },
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    reference: sequelize_1.DataTypes.STRING,
    createdBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "inventory_movements" });
