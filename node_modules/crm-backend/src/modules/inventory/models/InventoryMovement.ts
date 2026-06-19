import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum InventoryMovementType {
  STOCK_IN = "STOCK_IN",
  STOCK_OUT = "STOCK_OUT",
  ADJUSTMENT = "ADJUSTMENT",
  RETURN = "RETURN"
}

export interface IInventoryMovement {
  id: string;
  readonly _id: string;
  productId: string;
  type: InventoryMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  reference?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

type InventoryMovementCreation = Optional<
  IInventoryMovement,
  "id" | "_id" | "reference" | "createdAt" | "updatedAt"
>;

export class InventoryMovement
  extends Model<IInventoryMovement, InventoryMovementCreation>
  implements IInventoryMovement
{
  declare id: string;
  declare readonly _id: string;
  declare productId: string;
  declare type: InventoryMovementType;
  declare quantity: number;
  declare previousQuantity: number;
  declare newQuantity: number;
  declare reason: string;
  declare reference: string | null;
  declare createdBy: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InventoryMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get(this: InventoryMovement) {
        return this.id;
      }
    },
    productId: { type: DataTypes.UUID, allowNull: false },
    type: {
      type: DataTypes.ENUM(...Object.values(InventoryMovementType)),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    previousQuantity: { type: DataTypes.INTEGER, allowNull: false },
    newQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 }
    },
    reason: { type: DataTypes.STRING, allowNull: false },
    reference: DataTypes.STRING,
    createdBy: { type: DataTypes.UUID, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "inventory_movements" }
);
