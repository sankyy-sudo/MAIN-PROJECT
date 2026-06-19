"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadActivity = exports.LeadActivityType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var LeadActivityType;
(function (LeadActivityType) {
    LeadActivityType["NOTE"] = "NOTE";
    LeadActivityType["STATUS_CHANGE"] = "STATUS_CHANGE";
    LeadActivityType["CALL"] = "CALL";
    LeadActivityType["EMAIL"] = "EMAIL";
    LeadActivityType["MEETING"] = "MEETING";
})(LeadActivityType || (exports.LeadActivityType = LeadActivityType = {}));
class LeadActivity extends sequelize_1.Model {
}
exports.LeadActivity = LeadActivity;
LeadActivity.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    lead: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(LeadActivityType)),
        allowNull: false,
        defaultValue: LeadActivityType.NOTE
    },
    message: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    createdBy: sequelize_1.DataTypes.UUID,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "lead_activities" });
