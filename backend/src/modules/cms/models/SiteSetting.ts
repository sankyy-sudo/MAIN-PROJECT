import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum SiteSettingGroup {
  SEO = "SEO",
  SOCIAL = "SOCIAL",
  ACADEMY = "ACADEMY"
}

export interface ISiteSetting {
  id: string;
  readonly _id: string;
  group: SiteSettingGroup;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

type SiteSettingCreation = Optional<
  ISiteSetting,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export class SiteSetting
  extends Model<ISiteSetting, SiteSettingCreation>
  implements ISiteSetting
{
  declare id: string;
  declare readonly _id: string;
  declare group: SiteSettingGroup;
  declare key: string;
  declare value: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SiteSetting.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: SiteSetting) { return this.id; } },
    group: {
      type: DataTypes.ENUM(...Object.values(SiteSettingGroup)),
      allowNull: false
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      set(this: SiteSetting, value: string) {
        this.setDataValue("key", value.trim());
      }
    },
    value: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "cms_site_settings",
    indexes: [{ unique: true, fields: ["group", "key"] }]
  }
);
