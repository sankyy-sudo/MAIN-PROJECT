import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IInvoice {
  id: string;
  readonly _id: string;
  orderId: string;
  invoiceNumber: string;
  issuedAt: Date;
  dueAt?: Date | null;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

type InvoiceCreation = Optional<
  IInvoice,
  "id" | "_id" | "invoiceNumber" | "issuedAt" | "dueAt" | "createdAt" | "updatedAt"
>;

export class Invoice
  extends Model<IInvoice, InvoiceCreation>
  implements IInvoice
{
  declare id: string;
  declare readonly _id: string;
  declare orderId: string;
  declare invoiceNumber: string;
  declare issuedAt: Date;
  declare dueAt: Date | null;
  declare amount: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Invoice.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Invoice) { return this.id; } },
    orderId: { type: DataTypes.UUID, allowNull: false, unique: true },
    invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    issuedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    dueAt: DataTypes.DATE,
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "invoices" }
);
