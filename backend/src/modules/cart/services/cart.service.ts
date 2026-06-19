import crypto from "crypto";
import { Op } from "sequelize";
import { Product } from "../../inventory/models/Product";
import { Cart } from "../models/Cart";
import { CartItem } from "../models/CartItem";

const sevenDaysFromNow = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const cartIncludes = [
  {
    model: CartItem,
    as: "items",
    include: [
      {
        model: Product,
        as: "product",
        attributes: [
          "id",
          "name",
          "sku",
          "images",
          "retailPrice",
          "stockQuantity",
          "isActive"
        ]
      }
    ]
  }
];

export class CartService {
  async getOrCreateCart(customerId?: string, sessionId?: string) {
    const where = customerId ? { customerId } : { sessionId };
    let cart = await Cart.findOne({
      where: {
        ...where,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!cart) {
      cart = await Cart.create({
        customerId,
        sessionId: sessionId || crypto.randomUUID(),
        expiresAt: sevenDaysFromNow()
      });
    }
    return cart;
  }

  async getCartWithItems(cartId: string) {
    return Cart.findByPk(cartId, { include: cartIncludes });
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive whole number");
    }

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) throw new Error("Product not available");

    const existing = await CartItem.findOne({ where: { cartId, productId } });
    const nextQuantity = (existing?.quantity || 0) + quantity;
    if (product.stockQuantity < nextQuantity) {
      throw new Error("Requested quantity exceeds available stock");
    }

    if (existing) {
      await existing.update({ quantity: nextQuantity });
    } else {
      await CartItem.create({
        cartId,
        productId,
        quantity,
        unitPrice: Number(product.retailPrice)
      });
    }
    return this.getCartWithItems(cartId);
  }

  async updateItem(cartId: string, cartItemId: string, quantity: number) {
    const item = await CartItem.findOne({ where: { id: cartItemId, cartId } });
    if (!item) throw new Error("Cart item not found");

    if (quantity <= 0) {
      await item.destroy();
      return this.getCartWithItems(cartId);
    }

    const product = await Product.findByPk(item.productId);
    if (!product || !product.isActive) throw new Error("Product not available");
    if (product.stockQuantity < quantity) {
      throw new Error("Requested quantity exceeds available stock");
    }

    await item.update({ quantity });
    return this.getCartWithItems(cartId);
  }

  async removeItem(cartId: string, cartItemId: string) {
    const item = await CartItem.findOne({ where: { id: cartItemId, cartId } });
    if (item) await item.destroy();
    return this.getCartWithItems(cartId);
  }

  async clearCart(cartId: string) {
    await CartItem.destroy({ where: { cartId } });
    return this.getCartWithItems(cartId);
  }

  async mergeGuestCart(sessionId: string | undefined, customerId: string) {
    const customerCart = await this.getOrCreateCart(customerId);
    if (!sessionId) return this.getCartWithItems(customerCart.id);

    const guestCart = await Cart.findOne({
      where: {
        sessionId,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ model: CartItem, as: "items" }]
    });
    if (!guestCart || guestCart.id === customerCart.id) {
      return this.getCartWithItems(customerCart.id);
    }

    const items = ((guestCart as any).items || []) as CartItem[];
    for (const item of items) {
      await this.addItem(customerCart.id, item.productId, item.quantity);
    }
    await guestCart.destroy();
    return this.getCartWithItems(customerCart.id);
  }
}
