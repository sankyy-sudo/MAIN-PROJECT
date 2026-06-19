"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.PaymentRecordStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var PaymentRecordStatus;
(function (PaymentRecordStatus) {
    PaymentRecordStatus["PENDING"] = "PENDING";
    PaymentRecordStatus["SUCCEEDED"] = "SUCCEEDED";
    PaymentRecordStatus["FAILED"] = "FAILED";
    PaymentRecordStatus["REFUNDED"] = "REFUNDED";
})(PaymentRecordStatus || (exports.PaymentRecordStatus = PaymentRecordStatus = {}));
class Payment extends sequelize_1.Model {
}
exports.Payment = Payment;
Payment.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    orderId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    stripePaymentIntentId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: {
        type: sequelize_1.DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "gbp"
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentRecordStatus)),
        allowNull: false,
        defaultValue: PaymentRecordStatus.PENDING
    },
    metadata: { type: sequelize_1.DataTypes.JSONB, allowNull: false, defaultValue: {} },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "payments" });
