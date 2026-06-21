import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum AutomationType {
  ABANDONED_CART = "ABANDONED_CART",
  WELCOME = "WELCOME",
  CAMPAIGN = "CAMPAIGN"
}

export interface IEmailAutomationLog {
  id: string;
  readonly _id: string;
  type: AutomationType;
  recipient: string;
  referenceId?: string | null;
  status: string;
  metadata: Record<string, unknown>;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type EmailAutomationLogCreation = Optional<
  IEmailAutomationLog,
  "id" | "_id" | "referenceId" | "metadata" | "sentAt" | "createdAt" | "updatedAt"
>;

export class EmailAutomationLog
  extends Model<IEmailAutomationLog, EmailAutomationLogCreation>
  implements IEmailAutomationLog
{
  declare id: string;
  declare readonly _id: string;
  declare type: AutomationType;
  declare recipient: string;
  declare referenceId: string | null;
  declare status: string;
  declare metadata: Record<string, unknown>;
  declare sentAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

EmailAutomationLog.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: EmailAutomationLog) { return this.id; } },
    type: {
      type: DataTypes.ENUM(...Object.values(AutomationType)),
      allowNull: false
    },
    recipient: { type: DataTypes.STRING, allowNull: false },
    referenceId: DataTypes.UUID,
    status: { type: DataTypes.STRING, allowNull: false },
    metadata: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
    sentAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "email_automation_logs" }
);
