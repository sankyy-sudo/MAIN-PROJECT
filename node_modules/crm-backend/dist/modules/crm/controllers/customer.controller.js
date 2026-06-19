"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = exports.CustomerController = void 0;
const customer_service_1 = require("../services/customer.service");
const service = new customer_service_1.CustomerService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class CustomerController {
    async createCustomer(req, res) {
        const customer = await service.createCustomer(req.body);
        return res.status(201).json({
            success: true,
            data: customer
        });
    }
    async getCustomers(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await service.getCustomers(page, limit);
        return res.json({
            success: true,
            data: result
        });
    }
    async getCustomerById(req, res) {
        const customer = await service.getCustomerById(getParamId(req.params.id));
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        return res.json({
            success: true,
            data: customer
        });
    }
    async updateCustomer(req, res) {
        const customer = await service.updateCustomer(getParamId(req.params.id), req.body);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        return res.json({
            success: true,
            data: customer
        });
    }
    async deleteCustomer(req, res) {
        const customer = await service.deleteCustomer(getParamId(req.params.id));
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        return res.json({
            success: true,
            message: "Customer deleted successfully"
        });
    }
    async getCustomerTimeline(req, res) {
        const timeline = await service.getCustomerTimeline(getParamId(req.params.id));
        return res.json({
            success: true,
            data: timeline
        });
    }
    async addCustomerNote(req, res) {
        const note = await service.addCustomerNote(getParamId(req.params.id), {
            title: req.body.title,
            description: req.body.description,
            createdBy: req.user?.id
        });
        return res.status(201).json({
            success: true,
            data: note
        });
    }
    async addCustomerDocument(req, res) {
        const document = await service.addCustomerDocument(getParamId(req.params.id), {
            title: req.body.title,
            documentUrl: req.body.documentUrl,
            description: req.body.description,
            createdBy: req.user?.id
        });
        return res.status(201).json({
            success: true,
            data: document
        });
    }
}
exports.CustomerController = CustomerController;
exports.customerController = new CustomerController();
