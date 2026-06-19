"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = exports.LeadStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../../config/database");
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "NEW";
    LeadStatus["CONTACTED"] = "CONTACTED";
    LeadStatus["PROPOSAL_SENT"] = "PROPOSAL_SENT";
    LeadStatus["NEGOTIATION"] = "NEGOTIATION";
    LeadStatus["WON"] = "WON";
    LeadStatus["LOST"] = "LOST";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
class Lead extends sequelize_1.Model {
}
exports.Lead = Lead;
Lead.init({
    id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
    _id: { type: sequelize_1.DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    company: sequelize_1.DataTypes.STRING,
    email: sequelize_1.DataTypes.STRING,
    phone: sequelize_1.DataTypes.STRING,
    source: sequelize_1.DataTypes.STRING,
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(LeadStatus)),
        allowNull: false,
        defaultValue: LeadStatus.NEW
    },
    notes: sequelize_1.DataTypes.TEXT,
    assignedTo: sequelize_1.DataTypes.UUID,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, { sequelize: database_1.sequelize, tableName: "leads" });
