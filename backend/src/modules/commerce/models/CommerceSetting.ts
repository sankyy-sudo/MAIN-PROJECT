import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum CommerceSettingGroup {
  PAYMENT = "PAYMENT",
  SHIPPING = "SHIPPING"
}

export interface ICommerceSetting {
  id: string;
  readonly _id: string;
  group: CommerceSettingGroup;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

type CommerceSettingCreation = Optional<
  ICommerceSetting,
  "id" | "_id" | "createdAt" | "updatedAt"
>;

export class CommerceSetting
  extends Model<ICommerceSetting, CommerceSettingCreation>
  implements ICommerceSetting
{
  declare id: string;
  declare readonly _id: string;
  declare group: CommerceSettingGroup;
  declare key: string;
  declare value: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CommerceSetting.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: CommerceSetting) { return this.id; } },
    group: {
      type: DataTypes.ENUM(...Object.values(CommerceSettingGroup)),
      allowNull: false
    },
    key: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "commerce_settings",
    indexes: [{ unique: true, fields: ["group", "key"] }]
  }
);
