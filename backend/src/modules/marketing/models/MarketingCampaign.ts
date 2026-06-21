import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum CampaignStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  SENT = "SENT",
  PAUSED = "PAUSED"
}

export interface IMarketingCampaign {
  id: string;
  readonly _id: string;
  name: string;
  subject: string;
  previewText?: string | null;
  body: string;
  status: CampaignStatus;
  scheduledAt?: Date | null;
  sentAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type MarketingCampaignCreation = Optional<
  IMarketingCampaign,
  | "id"
  | "_id"
  | "previewText"
  | "status"
  | "scheduledAt"
  | "sentAt"
  | "createdAt"
  | "updatedAt"
>;

export class MarketingCampaign
  extends Model<IMarketingCampaign, MarketingCampaignCreation>
  implements IMarketingCampaign
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare subject: string;
  declare previewText: string | null;
  declare body: string;
  declare status: CampaignStatus;
  declare scheduledAt: Date | null;
  declare sentAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

MarketingCampaign.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: MarketingCampaign) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    previewText: DataTypes.TEXT,
    body: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM(...Object.values(CampaignStatus)),
      allowNull: false,
      defaultValue: CampaignStatus.DRAFT
    },
    scheduledAt: DataTypes.DATE,
    sentAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "marketing_campaigns" }
);
