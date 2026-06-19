import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  REFUNDED = "REFUNDED"
}

export interface IOrder {
  id: string;
  readonly _id: string;
  orderNumber: string;
  customerId?: string | null;
  businessAccountId?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: string;
  notes?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

type OrderCreation = Optional<
  IOrder,
  | "id"
  | "_id"
  | "orderNumber"
  | "customerId"
  | "businessAccountId"
  | "status"
  | "paymentStatus"
  | "discountAmount"
  | "taxAmount"
  | "shippingAmount"
  | "notes"
  | "createdAt"
  | "updatedAt"
>;

export class Order extends Model<IOrder, OrderCreation> implements IOrder {
  declare id: string;
  declare readonly _id: string;
  declare orderNumber: string;
  declare customerId: string | null;
  declare businessAccountId: string | null;
  declare status: OrderStatus;
  declare paymentStatus: PaymentStatus;
  declare subtotal: number;
  declare discountAmount: number;
  declare taxAmount: number;
  declare shippingAmount: number;
  declare totalAmount: number;
  declare shippingAddress: string;
  declare notes: string | null;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Order.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Order) { return this.id; } },
    orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    customerId: DataTypes.UUID,
    businessAccountId: DataTypes.UUID,
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDING
    },
    paymentStatus: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING
    },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    discountAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    taxAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    shippingAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    shippingAddress: { type: DataTypes.TEXT, allowNull: false },
    notes: DataTypes.TEXT,
    createdBy: { type: DataTypes.UUID, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "orders" }
);
