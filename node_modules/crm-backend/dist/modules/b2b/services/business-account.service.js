"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessAccountService = void 0;
const sequelize_1 = require("sequelize");
const BusinessAccount_1 = require("../models/BusinessAccount");
const Invoice_1 = require("../../orders/models/Invoice");
const Order_1 = require("../../orders/models/Order");
const tierDiscounts = {
    [BusinessAccount_1.PricingTier.SILVER]: 5,
    [BusinessAccount_1.PricingTier.GOLD]: 10,
    [BusinessAccount_1.PricingTier.PLATINUM]: 15
};
class BusinessAccountService {
    async createBusinessAccount(data) {
        const pricingTier = data.pricingTier || BusinessAccount_1.PricingTier.SILVER;
        return BusinessAccount_1.BusinessAccount.create({
            ...data,
            pricingTier,
            discountPercentage: data.discountPercentage ?? tierDiscounts[pricingTier]
        });
    }
    async getBusinessAccounts(page, limit, query = {}) {
        const where = {};
        if (query.search) {
            Object.assign(where, {
                [sequelize_1.Op.or]: [
                    { companyName: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { gstNumber: { [sequelize_1.Op.iLike]: `%${query.search}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${query.search}%` } }
                ]
            });
        }
        if (query.pricingTier) {
            Object.assign(where, { pricingTier: query.pricingTier });
        }
        const { rows, count } = await BusinessAccount_1.BusinessAccount.findAndCountAll({
            where,
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * limit,
            limit
        });
        return { accounts: rows, total: count, page, limit };
    }
    async getBusinessAccountById(id) {
        return BusinessAccount_1.BusinessAccount.findByPk(id);
    }
    async updateBusinessAccount(id, data) {
        const account = await BusinessAccount_1.BusinessAccount.findByPk(id);
        return account ? account.update(data) : null;
    }
    async deleteBusinessAccount(id) {
        const account = await BusinessAccount_1.BusinessAccount.findByPk(id);
        if (!account)
            return null;
        await account.destroy();
        return account;
    }
    async calculateDiscountedPrice(id, basePrice) {
        const account = await BusinessAccount_1.BusinessAccount.findByPk(id);
        if (!account)
            throw new Error("Business account not found");
        const discountPercentage = Number(account.discountPercentage);
        return {
            basePrice,
            discountPercentage,
            finalPrice: Math.max(basePrice - (basePrice * discountPercentage) / 100, 0)
        };
    }
    async getAccountDashboard(id) {
        const account = await BusinessAccount_1.BusinessAccount.findByPk(id);
        if (!account)
            throw new Error("Business account not found");
        return {
            account,
            pricingTier: account.pricingTier,
            customPricingCount: account.customPricing.length,
            bulkOrdersEnabled: account.bulkOrdersEnabled,
            invoiceDownloadEnabled: account.invoiceDownloadEnabled
        };
    }
    async getInvoices(id) {
        if (!(await BusinessAccount_1.BusinessAccount.findByPk(id))) {
            throw new Error("Business account not found");
        }
        return Invoice_1.Invoice.findAll({
            include: [
                {
                    model: Order_1.Order,
                    as: "order",
                    where: { businessAccountId: id },
                    attributes: ["id", "orderNumber", "status", "totalAmount"]
                }
            ],
            order: [["issuedAt", "DESC"]]
        });
    }
}
exports.BusinessAccountService = BusinessAccountService;
