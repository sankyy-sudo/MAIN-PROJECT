import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IShippingRule {
  id: string;
  readonly _id: string;
  name: string;
  region: string;
  baseFee: number;
  freeShippingThreshold?: number | null;
  minSubtotal: number;
  maxSubtotal?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ShippingRuleCreation = Optional<
  IShippingRule,
  | "id"
  | "_id"
  | "region"
  | "freeShippingThreshold"
  | "minSubtotal"
  | "maxSubtotal"
  | "isActive"
  | "createdAt"
  | "updatedAt"
>;

export class ShippingRule
  extends Model<IShippingRule, ShippingRuleCreation>
  implements IShippingRule
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare region: string;
  declare baseFee: number;
  declare freeShippingThreshold: number | null;
  declare minSubtotal: number;
  declare maxSubtotal: number | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ShippingRule.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: ShippingRule) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    region: { type: DataTypes.STRING, allowNull: false, defaultValue: "DEFAULT" },
    baseFee: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    freeShippingThreshold: DataTypes.DECIMAL(12, 2),
    minSubtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    maxSubtotal: DataTypes.DECIMAL(12, 2),
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "commerce_shipping_rules" }
);
