import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";
import { OrderStatus } from "./Order";

export interface IOrderEvent {
  id: string;
  readonly _id: string;
  orderId: string;
  status: OrderStatus;
  message: string;
  location?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

type OrderEventCreation = Optional<
  IOrderEvent,
  "id" | "_id" | "location" | "createdAt" | "updatedAt"
>;

export class OrderEvent
  extends Model<IOrderEvent, OrderEventCreation>
  implements IOrderEvent
{
  declare id: string;
  declare readonly _id: string;
  declare orderId: string;
  declare status: OrderStatus;
  declare message: string;
  declare location: string | null;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

OrderEvent.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: OrderEvent) { return this.id; } },
    orderId: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false
    },
    message: { type: DataTypes.STRING, allowNull: false },
    location: DataTypes.STRING,
    createdBy: { type: DataTypes.UUID, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "order_events" }
);
