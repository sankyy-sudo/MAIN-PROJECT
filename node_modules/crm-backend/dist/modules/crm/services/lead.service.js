"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const sequelize_1 = require("sequelize");
const User_1 = require("../../../models/User");
const Lead_1 = require("../models/Lead");
const LeadActivity_1 = require("../models/LeadActivity");
const userFields = ["id", "name", "email", "role"];
class LeadService {
    async createLead(data) {
        const lead = await Lead_1.Lead.create(data);
        await LeadActivity_1.LeadActivity.create({
            lead: lead.id,
            type: LeadActivity_1.LeadActivityType.NOTE,
            message: "Lead created",
            createdBy: data.assignedTo
        });
        return lead;
    }
    async getLeads(page, limit, query = {}) {
        const where = {};
        if (query.search) {
            Object.assign(where, {
                [sequelize_1.Op.or]: [
                    { name: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { company: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${query.search}%` } }
                ]
            });
        }
        if (query.status)
            Object.assign(where, { status: query.status });
        if (query.source)
            Object.assign(where, { source: query.source });
        if (query.assignedTo)
            Object.assign(where, { assignedTo: query.assignedTo });
        const { rows, count } = await Lead_1.Lead.findAndCountAll({
            where,
            include: [{ model: User_1.User, as: "assignedUser", attributes: userFields }],
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * limit,
            limit
        });
        const leads = rows.map((lead) => {
            const value = lead.toJSON();
            value.assignedTo = value.assignedUser || value.assignedTo;
            delete value.assignedUser;
            return value;
        });
        return { leads, total: count, page, limit };
    }
    async getLeadById(id) {
        return Lead_1.Lead.findByPk(id);
    }
    async updateLead(id, data, actorId) {
        const lead = await Lead_1.Lead.findByPk(id);
        if (!lead)
            return null;
        const previousStatus = lead.status;
        await lead.update(data);
        if (data.status && previousStatus !== data.status) {
            await LeadActivity_1.LeadActivity.create({
                lead: id,
                type: LeadActivity_1.LeadActivityType.STATUS_CHANGE,
                message: `Status changed from ${previousStatus} to ${data.status}`,
                createdBy: actorId
            });
        }
        return lead;
    }
    async deleteLead(id) {
        const lead = await Lead_1.Lead.findByPk(id);
        if (!lead)
            return null;
        await lead.destroy();
        return lead;
    }
    async getLeadTimeline(id) {
        return LeadActivity_1.LeadActivity.findAll({
            where: { lead: id },
            include: [{ model: User_1.User, as: "creator", attributes: userFields }],
            order: [["createdAt", "DESC"]]
        });
    }
    async addLeadActivity(id, data) {
        return LeadActivity_1.LeadActivity.create({
            lead: id,
            type: data.type || LeadActivity_1.LeadActivityType.NOTE,
            message: data.message,
            createdBy: data.createdBy
        });
    }
}
exports.LeadService = LeadService;
