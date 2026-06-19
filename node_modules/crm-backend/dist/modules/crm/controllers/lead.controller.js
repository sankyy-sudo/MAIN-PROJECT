"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadController = exports.LeadController = void 0;
const lead_service_1 = require("../services/lead.service");
const service = new lead_service_1.LeadService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class LeadController {
    async createLead(req, res) {
        const lead = await service.createLead(req.body);
        res.status(201)
            .json({
            success: true,
            data: lead
        });
    }
    async getLeads(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await service.getLeads(page, limit, {
            search: req.query.search,
            status: req.query.status,
            source: req.query.source,
            assignedTo: req.query.assignedTo
        });
        res.json({
            success: true,
            data: result
        });
    }
    async getLeadById(req, res) {
        const lead = await service.getLeadById(getParamId(req.params.id));
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }
        return res.json({
            success: true,
            data: lead
        });
    }
    async updateLead(req, res) {
        const lead = await service.updateLead(getParamId(req.params.id), req.body, req.user?.id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }
        return res.json({
            success: true,
            data: lead
        });
    }
    async deleteLead(req, res) {
        const lead = await service.deleteLead(getParamId(req.params.id));
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }
        return res.json({
            success: true,
            message: "Lead deleted successfully"
        });
    }
    async getLeadTimeline(req, res) {
        const timeline = await service.getLeadTimeline(getParamId(req.params.id));
        return res.json({
            success: true,
            data: timeline
        });
    }
    async addLeadActivity(req, res) {
        const activity = await service.addLeadActivity(getParamId(req.params.id), {
            type: req.body.type,
            message: req.body.message,
            createdBy: req.user?.id
        });
        return res.status(201).json({
            success: true,
            data: activity
        });
    }
}
exports.LeadController = LeadController;
exports.leadController = new LeadController();
