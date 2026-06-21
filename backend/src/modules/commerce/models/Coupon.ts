import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum CouponDiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED"
}

export interface ICoupon {
  id: string;
  readonly _id: string;
  code: string;
  description?: string | null;
  discountType: CouponDiscountType;
  value: number;
  minSubtotal: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startsAt?: Date | null;
  endsAt?: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type CouponCreation = Optional<
  ICoupon,
  | "id"
  | "_id"
  | "description"
  | "minSubtotal"
  | "maxDiscount"
  | "usageLimit"
  | "usedCount"
  | "startsAt"
  | "endsAt"
  | "isActive"
  | "createdAt"
  | "updatedAt"
>;

export class Coupon extends Model<ICoupon, CouponCreation> implements ICoupon {
  declare id: string;
  declare readonly _id: string;
  declare code: string;
  declare description: string | null;
  declare discountType: CouponDiscountType;
  declare value: number;
  declare minSubtotal: number;
  declare maxDiscount: number | null;
  declare usageLimit: number | null;
  declare usedCount: number;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Coupon.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Coupon) { return this.id; } },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: Coupon, value: string) {
        this.setDataValue("code", value.trim().toUpperCase());
      }
    },
    description: DataTypes.TEXT,
    discountType: {
      type: DataTypes.ENUM(...Object.values(CouponDiscountType)),
      allowNull: false
    },
    value: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    minSubtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    maxDiscount: DataTypes.DECIMAL(12, 2),
    usageLimit: DataTypes.INTEGER,
    usedCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    startsAt: DataTypes.DATE,
    endsAt: DataTypes.DATE,
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "commerce_coupons" }
);
