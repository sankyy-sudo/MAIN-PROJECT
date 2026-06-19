"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerActivity = exports.CustomerActivityType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var CustomerActivityType;
(function (CustomerActivityType) {
    CustomerActivityType["NOTE"] = "NOTE";
    CustomerActivityType["DOCUMENT"] = "DOCUMENT";
    CustomerActivityType["UPDATE"] = "UPDATE";
})(CustomerActivityType || (exports.CustomerActivityType = CustomerActivityType = {}));
class CustomerActivity extends sequelize_1.Model {
}
exports.CustomerActivity = CustomerActivity;
CustomerActivity.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    customer: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(CustomerActivityType)),
        allowNull: false,
        defaultValue: CustomerActivityType.NOTE
    },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: sequelize_1.DataTypes.TEXT,
    documentUrl: sequelize_1.DataTypes.STRING,
    createdBy: sequelize_1.DataTypes.UUID,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "customer_activities" });
