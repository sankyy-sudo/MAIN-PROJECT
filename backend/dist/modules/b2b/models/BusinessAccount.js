"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessAccount = exports.PricingTier = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var PricingTier;
(function (PricingTier) {
    PricingTier["SILVER"] = "SILVER";
    PricingTier["GOLD"] = "GOLD";
    PricingTier["PLATINUM"] = "PLATINUM";
})(PricingTier || (exports.PricingTier = PricingTier = {}));
class BusinessAccount extends sequelize_1.Model {
}
exports.BusinessAccount = BusinessAccount;
BusinessAccount.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    companyName: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    gstNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue("gstNumber", value.trim().toUpperCase());
        }
    },
    businessAddress: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    contactPerson: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue("email", value.trim().toLowerCase());
        }
    },
    phone: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    pricingTier: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(PricingTier)),
        allowNull: false,
        defaultValue: PricingTier.SILVER
    },
    discountPercentage: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    customPricing: { type: sequelize_1.DataTypes.JSONB, allowNull: false, defaultValue: [] },
    bulkOrdersEnabled: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    invoiceDownloadEnabled: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "business_accounts" });
