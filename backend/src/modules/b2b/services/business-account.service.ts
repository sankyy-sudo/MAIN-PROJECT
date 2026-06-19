import { Op, WhereOptions } from "sequelize";
import {
  BusinessAccount,
  IBusinessAccount,
  PricingTier
} from "../models/BusinessAccount";
import { Invoice } from "../../orders/models/Invoice";
import { Order } from "../../orders/models/Order";

interface BusinessAccountQuery {
  search?: string;
  pricingTier?: PricingTier;
}

const tierDiscounts: Record<PricingTier, number> = {
  [PricingTier.SILVER]: 5,
  [PricingTier.GOLD]: 10,
  [PricingTier.PLATINUM]: 15
};

export class BusinessAccountService {
  async createBusinessAccount(data: Partial<IBusinessAccount>) {
    const pricingTier = data.pricingTier || PricingTier.SILVER;
    return BusinessAccount.create({
      ...data,
      pricingTier,
      discountPercentage:
        data.discountPercentage ?? tierDiscounts[pricingTier]
    } as any);
  }

  async getBusinessAccounts(
    page: number,
    limit: number,
    query: BusinessAccountQuery = {}
  ) {
    const where: WhereOptions = {};

    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          { companyName: { [Op.iLike]: `%${query.search}%` } },
          { gstNumber: { [Op.iLike]: `%${query.search}%` } },
          { email: { [Op.iLike]: `%${query.search}%` } }
        ]
      });
    }
    if (query.pricingTier) {
      Object.assign(where, { pricingTier: query.pricingTier });
    }

    const { rows, count } = await BusinessAccount.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit
    });

    return { accounts: rows, total: count, page, limit };
  }

  async getBusinessAccountById(id: string) {
    return BusinessAccount.findByPk(id);
  }

  async updateBusinessAccount(id: string, data: Partial<IBusinessAccount>) {
    const account = await BusinessAccount.findByPk(id);
    return account ? account.update(data) : null;
  }

  async deleteBusinessAccount(id: string) {
    const account = await BusinessAccount.findByPk(id);
    if (!account) return null;
    await account.destroy();
    return account;
  }

  async calculateDiscountedPrice(id: string, basePrice: number) {
    const account = await BusinessAccount.findByPk(id);
    if (!account) throw new Error("Business account not found");

    const discountPercentage = Number(account.discountPercentage);
    return {
      basePrice,
      discountPercentage,
      finalPrice: Math.max(basePrice - (basePrice * discountPercentage) / 100, 0)
    };
  }

  async getAccountDashboard(id: string) {
    const account = await BusinessAccount.findByPk(id);
    if (!account) throw new Error("Business account not found");

    return {
      account,
      pricingTier: account.pricingTier,
      customPricingCount: account.customPricing.length,
      bulkOrdersEnabled: account.bulkOrdersEnabled,
      invoiceDownloadEnabled: account.invoiceDownloadEnabled
    };
  }

  async getInvoices(id: string) {
    if (!(await BusinessAccount.findByPk(id))) {
      throw new Error("Business account not found");
    }
    return Invoice.findAll({
      include: [
        {
          model: Order,
          as: "order",
          where: { businessAccountId: id },
          attributes: ["id", "orderNumber", "status", "totalAmount"]
        }
      ],
      order: [["issuedAt", "DESC"]]
    });
  }
}
