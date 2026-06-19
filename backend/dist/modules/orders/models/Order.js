"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.PaymentStatus = exports.OrderStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["PACKED"] = "PACKED";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    orderNumber: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    customerId: sequelize_1.DataTypes.UUID,
    businessAccountId: sequelize_1.DataTypes.UUID,
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.PENDING
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING
    },
    subtotal: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    discountAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    taxAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    shippingAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    totalAmount: { type: sequelize_1.DataTypes.DECIMAL(12, 2), allowNull: false },
    shippingAddress: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    notes: sequelize_1.DataTypes.TEXT,
    createdBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "orders" });
