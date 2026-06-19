import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface ICartItem {
  id: string;
  readonly _id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

type CartItemCreation = Optional<
  ICartItem,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export class CartItem
  extends Model<ICartItem, CartItemCreation>
  implements ICartItem
{
  declare id: string;
  declare readonly _id: string;
  declare cartId: string;
  declare productId: string;
  declare quantity: number;
  declare unitPrice: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CartItem.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: CartItem) { return this.id; } },
    cartId: { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "cart_items",
    indexes: [{ unique: true, fields: ["cartId", "productId"] }]
  }
);
