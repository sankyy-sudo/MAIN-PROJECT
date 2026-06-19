import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum RefundStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED"
}

export interface IRefund {
  id: string;
  readonly _id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

type RefundCreation = Optional<
  IRefund,
  "id" | "_id" | "status" | "createdAt" | "updatedAt"
>;

export class Refund
  extends Model<IRefund, RefundCreation>
  implements IRefund
{
  declare id: string;
  declare readonly _id: string;
  declare orderId: string;
  declare amount: number;
  declare reason: string;
  declare status: RefundStatus;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Refund.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Refund) { return this.id; } },
    orderId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0.01 } },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(RefundStatus)),
      allowNull: false,
      defaultValue: RefundStatus.PENDING
    },
    createdBy: { type: DataTypes.UUID, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "refunds" }
);
