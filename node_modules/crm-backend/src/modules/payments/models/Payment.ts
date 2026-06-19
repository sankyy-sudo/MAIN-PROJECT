import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum PaymentRecordStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export interface IPayment {
  id: string;
  readonly _id: string;
  orderId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

type PaymentCreation = Optional<
  IPayment,
  "id" | "_id" | "currency" | "status" | "metadata" | "createdAt" | "updatedAt"
>;

export class Payment
  extends Model<IPayment, PaymentCreation>
  implements IPayment
{
  declare id: string;
  declare readonly _id: string;
  declare orderId: string;
  declare stripePaymentIntentId: string;
  declare amount: number;
  declare currency: string;
  declare status: PaymentRecordStatus;
  declare metadata: Record<string, string>;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Payment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Payment) { return this.id; } },
    orderId: { type: DataTypes.UUID, allowNull: false },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "gbp"
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentRecordStatus)),
      allowNull: false,
      defaultValue: PaymentRecordStatus.PENDING
    },
    metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "payments" }
);
