import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IOrderItem {
  id: string;
  readonly _id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

type OrderItemCreation = Optional<
  IOrderItem,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export class OrderItem
  extends Model<IOrderItem, OrderItemCreation>
  implements IOrderItem
{
  declare id: string;
  declare readonly _id: string;
  declare orderId: string;
  declare productId: string;
  declare productName: string;
  declare sku: string;
  declare quantity: number;
  declare unitPrice: number;
  declare lineTotal: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

OrderItem.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: OrderItem) { return this.id; } },
    orderId: { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    productName: { type: DataTypes.STRING, allowNull: false },
    sku: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    unitPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    lineTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "order_items" }
);
