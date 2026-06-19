import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum PricingTier {
  SILVER = "SILVER",
  GOLD = "GOLD",
  PLATINUM = "PLATINUM"
}

export interface ICustomPricing {
  productName: string;
  sku?: string;
  price: number;
}

export interface IBusinessAccount {
  id: string;
  readonly _id: string;
  companyName: string;
  gstNumber: string;
  businessAddress: string;
  contactPerson: string;
  email: string;
  phone: string;
  pricingTier: PricingTier;
  discountPercentage: number;
  customPricing: ICustomPricing[];
  bulkOrdersEnabled: boolean;
  invoiceDownloadEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type BusinessAccountCreation = Optional<
  IBusinessAccount,
  | "id"
  | "_id"
  | "pricingTier"
  | "discountPercentage"
  | "customPricing"
  | "bulkOrdersEnabled"
  | "invoiceDownloadEnabled"
  | "createdAt"
  | "updatedAt"
>;

export class BusinessAccount
  extends Model<IBusinessAccount, BusinessAccountCreation>
  implements IBusinessAccount
{
  declare id: string;
  declare readonly _id: string;
  declare companyName: string;
  declare gstNumber: string;
  declare businessAddress: string;
  declare contactPerson: string;
  declare email: string;
  declare phone: string;
  declare pricingTier: PricingTier;
  declare discountPercentage: number;
  declare customPricing: ICustomPricing[];
  declare bulkOrdersEnabled: boolean;
  declare invoiceDownloadEnabled: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BusinessAccount.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: BusinessAccount) { return this.id; } },
    companyName: { type: DataTypes.STRING, allowNull: false },
    gstNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: BusinessAccount, value: string) {
        this.setDataValue("gstNumber", value.trim().toUpperCase());
      }
    },
    businessAddress: { type: DataTypes.TEXT, allowNull: false },
    contactPerson: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      set(this: BusinessAccount, value: string) {
        this.setDataValue("email", value.trim().toLowerCase());
      }
    },
    phone: { type: DataTypes.STRING, allowNull: false },
    pricingTier: {
      type: DataTypes.ENUM(...Object.values(PricingTier)),
      allowNull: false,
      defaultValue: PricingTier.SILVER
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 100 }
    },
    customPricing: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    bulkOrdersEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    invoiceDownloadEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "business_accounts" }
);
