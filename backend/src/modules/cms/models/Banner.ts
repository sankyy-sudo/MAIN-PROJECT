import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum BannerPortal {
  RETAIL = "RETAIL",
  PROFESSIONAL = "PROFESSIONAL"
}

export enum BannerPlacement {
  HOME_HERO = "HOME_HERO",
  CATEGORY = "CATEGORY",
  PRODUCT = "PRODUCT",
  CHECKOUT = "CHECKOUT"
}

export interface IBanner {
  id: string;
  readonly _id: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  portal: BannerPortal;
  placement: BannerPlacement;
  sortOrder: number;
  isActive: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type BannerCreation = Optional<
  IBanner,
  | "id"
  | "_id"
  | "subtitle"
  | "ctaLabel"
  | "ctaUrl"
  | "portal"
  | "placement"
  | "sortOrder"
  | "isActive"
  | "startsAt"
  | "endsAt"
  | "createdAt"
  | "updatedAt"
>;

export class Banner extends Model<IBanner, BannerCreation> implements IBanner {
  declare id: string;
  declare readonly _id: string;
  declare title: string;
  declare subtitle: string | null;
  declare imageUrl: string;
  declare ctaLabel: string | null;
  declare ctaUrl: string | null;
  declare portal: BannerPortal;
  declare placement: BannerPlacement;
  declare sortOrder: number;
  declare isActive: boolean;
  declare startsAt: Date | null;
  declare endsAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Banner.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: Banner) { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    subtitle: DataTypes.TEXT,
    imageUrl: { type: DataTypes.TEXT, allowNull: false },
    ctaLabel: DataTypes.STRING,
    ctaUrl: DataTypes.TEXT,
    portal: {
      type: DataTypes.ENUM(...Object.values(BannerPortal)),
      allowNull: false,
      defaultValue: BannerPortal.RETAIL
    },
    placement: {
      type: DataTypes.ENUM(...Object.values(BannerPlacement)),
      allowNull: false,
      defaultValue: BannerPlacement.HOME_HERO
    },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    startsAt: DataTypes.DATE,
    endsAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "cms_banners" }
);
