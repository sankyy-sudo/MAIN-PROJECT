import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum LeadActivityType {
  NOTE = "NOTE",
  STATUS_CHANGE = "STATUS_CHANGE",
  CALL = "CALL",
  EMAIL = "EMAIL",
  MEETING = "MEETING"
}

export interface ILeadActivity {
  id: string;
  readonly _id: string;
  lead: string;
  type: LeadActivityType;
  message: string;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type LeadActivityCreation = Optional<
  ILeadActivity,
  "id" | "_id" | "type" | "createdBy" | "createdAt" | "updatedAt"
>;

export class LeadActivity
  extends Model<ILeadActivity, LeadActivityCreation>
  implements ILeadActivity
{
  declare id: string;
  declare readonly _id: string;
  declare lead: string;
  declare type: LeadActivityType;
  declare message: string;
  declare createdBy: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

LeadActivity.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: LeadActivity) { return this.id; } },
    lead: { type: DataTypes.UUID, allowNull: false },
    type: {
      type: DataTypes.ENUM(...Object.values(LeadActivityType)),
      allowNull: false,
      defaultValue: LeadActivityType.NOTE
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    createdBy: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "lead_activities" }
);
