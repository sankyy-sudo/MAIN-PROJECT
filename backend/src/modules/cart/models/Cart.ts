import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface ICart {
  id: string;
  readonly _id: string;
  customerId?: string | null;
  sessionId?: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type CartCreation = Optional<
  ICart,
  "id" | "_id" | "customerId" | "sessionId" | "createdAt" | "updatedAt"
>;

export class Cart extends Model<ICart, CartCreation> implements ICart {
  declare id: string;
  declare readonly _id: string;
  declare customerId: string | null;
  declare sessionId: string | null;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cart.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Cart) { return this.id; } },
    customerId: DataTypes.UUID,
    sessionId: DataTypes.STRING,
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "carts" }
);
