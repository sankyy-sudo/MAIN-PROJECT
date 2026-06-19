import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IInventorySetting {
  id: string;
  readonly _id: string;
  productId: string;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

type InventorySettingCreation = Optional<
  IInventorySetting,
  "id" | "_id" | "lowStockThreshold" | "createdAt" | "updatedAt"
>;

export class InventorySetting
  extends Model<IInventorySetting, InventorySettingCreation>
  implements IInventorySetting
{
  declare id: string;
  declare readonly _id: string;
  declare productId: string;
  declare lowStockThreshold: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InventorySetting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get(this: InventorySetting) {
        return this.id;
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: { min: 0 }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "inventory_settings" }
);
