import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  PROPOSAL_SENT = "PROPOSAL_SENT",
  NEGOTIATION = "NEGOTIATION",
  WON = "WON",
  LOST = "LOST"
}

export interface ILead {
  id: string;
  readonly _id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  status: LeadStatus;
  notes?: string | null;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type LeadCreation = Optional<
  ILead,
  | "id"
  | "_id"
  | "company"
  | "email"
  | "phone"
  | "source"
  | "status"
  | "notes"
  | "assignedTo"
  | "createdAt"
  | "updatedAt"
>;

export class Lead extends Model<ILead, LeadCreation> implements ILead {
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare company: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare source: string | null;
  declare status: LeadStatus;
  declare notes: string | null;
  declare assignedTo: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Lead.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Lead) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    company: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    source: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(...Object.values(LeadStatus)),
      allowNull: false,
      defaultValue: LeadStatus.NEW
    },
    notes: DataTypes.TEXT,
    assignedTo: DataTypes.UUID,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "leads" }
);
