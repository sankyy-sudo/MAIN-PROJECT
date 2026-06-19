import { Op, WhereOptions } from "sequelize";
import { sequelize } from "../../../config/database";
import { User, UserRole, UserStatus } from "../../../models/User";
import { Product } from "../models/Product";
import {
  InventoryMovement,
  InventoryMovementType
} from "../models/InventoryMovement";
import { InventorySetting } from "../models/InventorySetting";
import { emailTemplates, sendTemplateEmail } from "../../../utils/email";

interface MovementInput {
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  reason: string;
  reference?: string;
  createdBy: string;
}

interface MovementQuery {
  productId?: string;
  type?: InventoryMovementType;
  page: number;
  limit: number;
}

const movementIncludes = [
  {
    model: Product,
    as: "productDetails",
    attributes: ["id", "name", "sku", "stockQuantity"]
  },
  {
    model: User,
    as: "actor",
    attributes: ["id", "name", "email", "role"]
  }
];

export class InventoryService {
  async recordMovement(input: MovementInput) {
    if (!Object.values(InventoryMovementType).includes(input.type)) {
      throw new Error("Invalid inventory movement type");
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      throw new Error("Quantity must be a positive whole number");
    }

    if (!input.reason?.trim()) {
      throw new Error("A reason is required for every stock movement");
    }

    const result = await sequelize.transaction(async (transaction) => {
      const product = await Product.findByPk(input.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!product) {
        throw new Error("Product not found");
      }

      const previousQuantity = product.stockQuantity;
      const addsStock =
        input.type === InventoryMovementType.STOCK_IN ||
        input.type === InventoryMovementType.RETURN;
      const newQuantity = addsStock
        ? previousQuantity + input.quantity
        : previousQuantity - input.quantity;

      if (newQuantity < 0) {
        throw new Error("Insufficient stock for this movement");
      }

      await product.update({ stockQuantity: newQuantity }, { transaction });

      const movement = await InventoryMovement.create(
        {
          ...input,
          previousQuantity,
          newQuantity
        },
        { transaction }
      );

      await InventorySetting.findOrCreate({
        where: { productId: product.id },
        defaults: { productId: product.id },
        transaction
      });

      return movement;
    });

    const setting = await InventorySetting.findOne({
      where: { productId: input.productId }
    });
    if (
      setting &&
      result.newQuantity <= setting.lowStockThreshold
    ) {
      const product = await Product.findByPk(input.productId);
      const managers = await User.findAll({
        where: {
          role: UserRole.INVENTORY_MANAGER,
          status: UserStatus.ACTIVE
        },
        attributes: ["email"]
      });
      if (product && managers.length) {
        await sendTemplateEmail(
          managers.map((manager) => manager.email),
          emailTemplates.lowStockAlert(
            product,
            result.newQuantity,
            setting.lowStockThreshold
          )
        );
      }
    }
    return result;
  }

  async getMovements(query: MovementQuery) {
    const where: WhereOptions = {};
    if (query.productId) Object.assign(where, { productId: query.productId });
    if (query.type) Object.assign(where, { type: query.type });

    const { rows, count } = await InventoryMovement.findAndCountAll({
      where,
      include: movementIncludes,
      order: [["createdAt", "DESC"]],
      offset: (query.page - 1) * query.limit,
      limit: query.limit
    });

    return {
      movements: rows,
      total: count,
      page: query.page,
      limit: query.limit
    };
  }

  async getLowStockProducts(search?: string) {
    const products = await Product.findAll({
      where: {
        isActive: true,
        ...(search
          ? {
              [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { sku: { [Op.iLike]: `%${search}%` } }
              ]
            }
          : {})
      },
      include: [
        {
          model: InventorySetting,
          as: "inventorySetting",
          required: false
        }
      ],
      order: [["stockQuantity", "ASC"]]
    });

    return products
      .map((product) => {
        const value = product.toJSON() as any;
        const threshold = value.inventorySetting?.lowStockThreshold ?? 10;
        return {
          ...value,
          lowStockThreshold: threshold,
          isLowStock: product.stockQuantity <= threshold
        };
      })
      .filter((product) => product.isLowStock);
  }

  async updateThreshold(productId: string, lowStockThreshold: number) {
    if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0) {
      throw new Error("Low stock threshold must be a non-negative whole number");
    }

    if (!(await Product.findByPk(productId))) {
      throw new Error("Product not found");
    }

    const [setting] = await InventorySetting.findOrCreate({
      where: { productId },
      defaults: { productId, lowStockThreshold }
    });

    if (setting.lowStockThreshold !== lowStockThreshold) {
      await setting.update({ lowStockThreshold });
    }

    return setting;
  }
}
