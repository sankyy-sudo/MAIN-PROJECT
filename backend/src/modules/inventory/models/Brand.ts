import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IBrand {
  id: string;
  readonly _id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type BrandCreation = Optional<
  IBrand,
  "id" | "_id" | "description" | "logoUrl" | "isActive" | "createdAt" | "updatedAt"
>;

export class Brand extends Model<IBrand, BrandCreation> implements IBrand {
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare description: string | null;
  declare logoUrl: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Brand.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Brand) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    logoUrl: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "brands" }
);
