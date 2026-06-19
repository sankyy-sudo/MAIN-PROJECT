import { Op, WhereOptions } from "sequelize";
import { Brand } from "../models/Brand";
import { Category } from "../models/Category";
import { IProduct, Product } from "../models/Product";

interface ProductQuery {
  search?: string;
  category?: string;
  brand?: string;
  isActive?: boolean;
}

const productIncludes = [
  { model: Category, as: "categoryDetails" },
  { model: Brand, as: "brandDetails" }
];

const serializeProduct = (product: Product) => {
  const value = product.toJSON() as any;
  value.category = value.categoryDetails;
  value.brand = value.brandDetails;
  delete value.categoryDetails;
  delete value.brandDetails;
  return value;
};

export class ProductService {
  async createProduct(data: Partial<IProduct>) {
    const product = await Product.create(data as any);
    return this.getProductById(product.id);
  }

  async getProducts(page: number, limit: number, query: ProductQuery = {}) {
    const where: WhereOptions = {};

    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query.search}%` } },
          { sku: { [Op.iLike]: `%${query.search}%` } },
          { description: { [Op.iLike]: `%${query.search}%` } }
        ]
      });
    }
    if (query.category) Object.assign(where, { category: query.category });
    if (query.brand) Object.assign(where, { brand: query.brand });
    if (typeof query.isActive === "boolean") {
      Object.assign(where, { isActive: query.isActive });
    }

    const { rows, count } = await Product.findAndCountAll({
      where,
      include: productIncludes,
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit
    });

    return { products: rows.map(serializeProduct), total: count, page, limit };
  }

  async getProductById(id: string) {
    const product = await Product.findByPk(id, { include: productIncludes });
    return product ? serializeProduct(product) : null;
  }

  async updateProduct(id: string, data: Partial<IProduct>) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.update(data);
    return this.getProductById(id);
  }

  async deleteProduct(id: string) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
}
