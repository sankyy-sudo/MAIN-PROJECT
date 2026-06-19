import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface ICustomer {
  id: string;
  readonly _id: string;
  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type CustomerCreation = Optional<
  ICustomer,
  | "id"
  | "_id"
  | "companyName"
  | "contactPerson"
  | "email"
  | "phone"
  | "address"
  | "notes"
  | "createdAt"
  | "updatedAt"
>;

export class Customer
  extends Model<ICustomer, CustomerCreation>
  implements ICustomer
{
  declare id: string;
  declare readonly _id: string;
  declare companyName: string | null;
  declare contactPerson: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare address: string | null;
  declare notes: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Customer.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Customer) { return this.id; } },
    companyName: DataTypes.STRING,
    contactPerson: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "customers" }
);
