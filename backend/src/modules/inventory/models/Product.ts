import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IProduct {
  id: string;
  readonly _id: string;
  name: string;
  sku: string;
  description?: string | null;
  images: string[];
  category: string;
  brand: string;
  retailPrice: number;
  wholesalePrice: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ProductCreation = Optional<
  IProduct,
  "id" | "_id" | "description" | "images" | "stockQuantity" | "isActive" | "createdAt" | "updatedAt"
>;

export class Product
  extends Model<IProduct, ProductCreation>
  implements IProduct
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare sku: string;
  declare description: string | null;
  declare images: string[];
  declare category: string;
  declare brand: string;
  declare retailPrice: number;
  declare wholesalePrice: number;
  declare stockQuantity: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Product) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: Product, value: string) {
        this.setDataValue("sku", value.trim().toUpperCase());
      }
    },
    description: DataTypes.TEXT,
    images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    category: { type: DataTypes.UUID, allowNull: false },
    brand: { type: DataTypes.UUID, allowNull: false },
    retailPrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    wholesalePrice: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { min: 0 } },
    stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "products" }
);
