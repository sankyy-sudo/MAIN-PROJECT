"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessAccountController = exports.BusinessAccountController = void 0;
const business_account_service_1 = require("../services/business-account.service");
const jwt_1 = require("../../../utils/jwt");
const service = new business_account_service_1.BusinessAccountService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class BusinessAccountController {
    async requestBusinessAccess(req, res) {
        try {
            const result = await service.requestBusinessAccess(req.user.id, req.body);
            return res.status(201).json({
                success: true,
                message: "Professional access enabled",
                data: {
                    ...result,
                    accessToken: (0, jwt_1.generateAccessToken)(result.user)
                }
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async myDashboard(req, res) {
        try {
            const result = await service.getMyBusinessAccount(req.user.id);
            return res.json({ success: true, data: result });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
    async myInvoices(req, res) {
        try {
            const invoices = await service.getMyInvoices(req.user.id);
            return res.json({ success: true, data: invoices });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
    async createBusinessAccount(req, res) {
        const account = await service.createBusinessAccount(req.body);
        return res.status(201).json({
            success: true,
            data: account
        });
    }
    async getBusinessAccounts(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await service.getBusinessAccounts(page, limit, {
            search: req.query.search,
            pricingTier: req.query.pricingTier
        });
        return res.json({
            success: true,
            data: result
        });
    }
    async getBusinessAccountById(req, res) {
        const account = await service.getBusinessAccountById(getParamId(req.params.id));
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Business account not found"
            });
        }
        return res.json({
            success: true,
            data: account
        });
    }
    async updateBusinessAccount(req, res) {
        const account = await service.updateBusinessAccount(getParamId(req.params.id), req.body);
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Business account not found"
            });
        }
        return res.json({
            success: true,
            data: account
        });
    }
    async deleteBusinessAccount(req, res) {
        const account = await service.deleteBusinessAccount(getParamId(req.params.id));
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Business account not found"
            });
        }
        return res.json({
            success: true,
            message: "Business account deleted successfully"
        });
    }
    async calculateDiscount(req, res) {
        try {
            const result = await service.calculateDiscountedPrice(getParamId(req.params.id), Number(req.body.basePrice));
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Unable to calculate discount"
            });
        }
    }
    async getAccountDashboard(req, res) {
        try {
            const result = await service.getAccountDashboard(getParamId(req.params.id));
            return res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Business account not found"
            });
        }
    }
    async getInvoices(req, res) {
        try {
            const invoices = await service.getInvoices(getParamId(req.params.id));
            return res.json({
                success: true,
                data: invoices
            });
        }
        catch (error) {
            return res.status(404).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Business account not found"
            });
        }
    }
}
exports.BusinessAccountController = BusinessAccountController;
exports.businessAccountController = new BusinessAccountController();
