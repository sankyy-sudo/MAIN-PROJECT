import { User } from "../../../models/User";
import { Cart } from "../../cart/models/Cart";
import { CartItem } from "../../cart/models/CartItem";
import { Order } from "../../orders/models/Order";
import { OrderItem } from "../../orders/models/OrderItem";

export class PrivacyService {
  async exportUserData(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    const orders = await Order.findAll({
      where: { createdBy: userId },
      include: [{ model: OrderItem, as: "items" }]
    });
    const carts = await Cart.findAll({
      where: { customerId: userId },
      include: [{ model: CartItem, as: "items" }]
    });
    return {
      exportedAt: new Date().toISOString(),
      user: user.toJSON(),
      orders,
      carts
    };
  }

  async deleteUserData(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await Cart.destroy({ where: { customerId: userId } });
    await user.update({
      name: "Deleted User",
      email: `deleted-${user.id}@deleted.local`,
      avatar: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      businessAccountId: null
    });
    return { deleted: true };
  }
}
