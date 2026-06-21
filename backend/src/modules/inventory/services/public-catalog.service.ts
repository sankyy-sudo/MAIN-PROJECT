import { Op, WhereOptions } from "sequelize";
import { UserRole } from "../../../models/User";
import { BusinessAccount } from "../../b2b/models/BusinessAccount";
import { Brand } from "../models/Brand";
import { Category } from "../models/Category";
import { InventorySetting } from "../models/InventorySetting";
import { Product } from "../models/Product";

interface PublicProductQuery {
  page: number;
  limit: number;
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

interface PublicViewer {
  role?: UserRole;
  businessAccountId?: string | null;
}

const publicIncludes = [
  { model: Category, as: "categoryDetails", attributes: ["id", "name"] },
  { model: Brand, as: "brandDetails", attributes: ["id", "name"] }
];

const detailIncludes = [
  ...publicIncludes,
  { model: InventorySetting, as: "inventorySetting" }
];

const canSeeWholesale = (viewer?: PublicViewer) =>
  Boolean(
    viewer?.businessAccountId ||
      (viewer?.role &&
      [
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.SALES_MANAGER,
        UserRole.INVENTORY_MANAGER
      ].includes(viewer.role))
  );

const stockStatus = (product: any) => {
  const threshold = product.inventorySetting?.lowStockThreshold ?? 5;
  if (Number(product.stockQuantity) <= 0) return "OUT_OF_STOCK";
  if (Number(product.stockQuantity) <= threshold) return "LOW_STOCK";
  return "IN_STOCK";
};

const discountedB2BPrice = (
  product: Product,
  account?: BusinessAccount | null
) => {
  const wholesalePrice = Number(product.wholesalePrice);
  if (!account) return wholesalePrice;
  const custom = account.customPricing?.find((item) => item.sku === product.sku);
  if (custom) return Number(custom.price);
  const discount = Number(account.discountPercentage || 0);
  return Math.max(wholesalePrice - (wholesalePrice * discount) / 100, 0);
};

const serializePublicProduct = (
  product: Product,
  viewer?: PublicViewer,
  account?: BusinessAccount | null
) => {
  const value = product.toJSON() as any;
  value.stockStatus = stockStatus(value);
  if (account) {
    value.b2bPrice = discountedB2BPrice(product, account);
    value.pricingTier = account.pricingTier;
    value.discountPercentage = Number(account.discountPercentage || 0);
  }
  if (!canSeeWholesale(viewer)) {
    delete value.wholesalePrice;
  }
  return value;
};

export class PublicCatalogService {
  async getProducts(query: PublicProductQuery, viewer?: PublicViewer) {
    const where: WhereOptions = { isActive: true };

    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query.search}%` } },
          { sku: { [Op.iLike]: `%${query.search}%` } }
        ]
      });
    }
    if (query.category) Object.assign(where, { category: query.category });
    if (query.brand) Object.assign(where, { brand: query.brand });
    if (query.inStock) {
      Object.assign(where, { stockQuantity: { [Op.gt]: 0 } });
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      Object.assign(where, {
        retailPrice: {
          ...(query.minPrice !== undefined ? { [Op.gte]: query.minPrice } : {}),
          ...(query.maxPrice !== undefined ? { [Op.lte]: query.maxPrice } : {})
        }
      });
    }

    const account = viewer?.businessAccountId
      ? await BusinessAccount.findByPk(viewer.businessAccountId)
      : null;

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: publicIncludes,
      order: [["createdAt", "DESC"]],
      offset: (query.page - 1) * query.limit,
      limit: query.limit,
      distinct: true
    });

    return {
      products: rows.map((product) =>
        serializePublicProduct(product, viewer, account)
      ),
      total: count,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(count / query.limit)
    };
  }

  async getProductById(id: string, viewer?: PublicViewer) {
    const account = viewer?.businessAccountId
      ? await BusinessAccount.findByPk(viewer.businessAccountId)
      : null;
    const product = await Product.findOne({
      where: { id, isActive: true },
      include: detailIncludes
    });
    return product ? serializePublicProduct(product, viewer, account) : null;
  }

  async getCategories() {
    return Category.findAll({
      where: { isActive: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]]
    });
  }

  async getBrands() {
    return Brand.findAll({
      where: { isActive: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]]
    });
  }
}
