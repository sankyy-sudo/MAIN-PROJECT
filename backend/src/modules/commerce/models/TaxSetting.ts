import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface ITaxSetting {
  id: string;
  readonly _id: string;
  name: string;
  region: string;
  rate: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type TaxSettingCreation = Optional<
  ITaxSetting,
  "id" | "_id" | "region" | "isDefault" | "isActive" | "createdAt" | "updatedAt"
>;

export class TaxSetting
  extends Model<ITaxSetting, TaxSettingCreation>
  implements ITaxSetting
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare region: string;
  declare rate: number;
  declare isDefault: boolean;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TaxSetting.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: TaxSetting) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    region: { type: DataTypes.STRING, allowNull: false, defaultValue: "DEFAULT" },
    rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
    isDefault: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "commerce_tax_settings" }
);
