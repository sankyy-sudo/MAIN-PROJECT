import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface ICategory {
  id: string;
  readonly _id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type CategoryCreation = Optional<
  ICategory,
  "id" | "_id" | "description" | "isActive" | "createdAt" | "updatedAt"
>;

export class Category
  extends Model<ICategory, CategoryCreation>
  implements ICategory
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare description: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Category.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Category) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.TEXT,
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "categories" }
);
