"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const User_1 = require("../../../models/User");
const Customer_1 = require("../models/Customer");
const CustomerActivity_1 = require("../models/CustomerActivity");
const creatorInclude = {
    model: User_1.User,
    as: "creator",
    attributes: ["id", "name", "email", "role"]
};
class CustomerService {
    async createCustomer(data) {
        const customer = await Customer_1.Customer.create(data);
        await CustomerActivity_1.CustomerActivity.create({
            customer: customer.id,
            type: CustomerActivity_1.CustomerActivityType.UPDATE,
            title: "Customer created"
        });
        return customer;
    }
    async getCustomers(page, limit) {
        const { rows, count } = await Customer_1.Customer.findAndCountAll({
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * limit,
            limit
        });
        return { customers: rows, total: count, page, limit };
    }
    async getCustomerById(id) {
        return Customer_1.Customer.findByPk(id);
    }
    async updateCustomer(id, data) {
        const customer = await Customer_1.Customer.findByPk(id);
        return customer ? customer.update(data) : null;
    }
    async deleteCustomer(id) {
        const customer = await Customer_1.Customer.findByPk(id);
        if (!customer)
            return null;
        await customer.destroy();
        return customer;
    }
    async getCustomerTimeline(id) {
        return CustomerActivity_1.CustomerActivity.findAll({
            where: { customer: id },
            include: [creatorInclude],
            order: [["createdAt", "DESC"]]
        });
    }
    async addCustomerNote(id, data) {
        return CustomerActivity_1.CustomerActivity.create({
            customer: id,
            type: CustomerActivity_1.CustomerActivityType.NOTE,
            title: data.title,
            description: data.description,
            createdBy: data.createdBy
        });
    }
    async addCustomerDocument(id, data) {
        return CustomerActivity_1.CustomerActivity.create({
            customer: id,
            type: CustomerActivity_1.CustomerActivityType.DOCUMENT,
            title: data.title,
            description: data.description,
            documentUrl: data.documentUrl,
            createdBy: data.createdBy
        });
    }
}
exports.CustomerService = CustomerService;
