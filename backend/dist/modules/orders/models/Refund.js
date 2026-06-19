"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refund = exports.RefundStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["PENDING"] = "PENDING";
    RefundStatus["APPROVED"] = "APPROVED";
    RefundStatus["REJECTED"] = "REJECTED";
    RefundStatus["COMPLETED"] = "COMPLETED";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
class Refund extends sequelize_1.Model {
}
exports.Refund = Refund;
Refund.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    orderId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0.01 } },
    reason: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(RefundStatus)),
        allowNull: false,
        defaultValue: RefundStatus.PENDING
    },
    createdBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "refunds" });
