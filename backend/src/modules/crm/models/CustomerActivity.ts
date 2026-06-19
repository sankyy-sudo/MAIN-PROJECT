import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum CustomerActivityType {
  NOTE = "NOTE",
  DOCUMENT = "DOCUMENT",
  UPDATE = "UPDATE"
}

export interface ICustomerActivity {
  id: string;
  readonly _id: string;
  customer: string;
  type: CustomerActivityType;
  title: string;
  description?: string | null;
  documentUrl?: string | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type CustomerActivityCreation = Optional<
  ICustomerActivity,
  | "id"
  | "_id"
  | "type"
  | "description"
  | "documentUrl"
  | "createdBy"
  | "createdAt"
  | "updatedAt"
>;

export class CustomerActivity
  extends Model<ICustomerActivity, CustomerActivityCreation>
  implements ICustomerActivity
{
  declare id: string;
  declare readonly _id: string;
  declare customer: string;
  declare type: CustomerActivityType;
  declare title: string;
  declare description: string | null;
  declare documentUrl: string | null;
  declare createdBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CustomerActivity.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: CustomerActivity) { return this.id; } },
    customer: { type: DataTypes.UUID, allowNull: false },
    type: {
      type: DataTypes.ENUM(...Object.values(CustomerActivityType)),
      allowNull: false,
      defaultValue: CustomerActivityType.NOTE
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    documentUrl: DataTypes.STRING,
    createdBy: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "customer_activities" }
);
