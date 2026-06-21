import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum PageType {
  LANDING = "LANDING",
  STATIC = "STATIC",
  PRIVACY = "PRIVACY",
  TERMS = "TERMS"
}

export interface ICmsPage {
  id: string;
  readonly _id: string;
  title: string;
  slug: string;
  type: PageType;
  summary?: string | null;
  body: string;
  heroImageUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type CmsPageCreation = Optional<
  ICmsPage,
  | "id"
  | "_id"
  | "type"
  | "summary"
  | "heroImageUrl"
  | "seoTitle"
  | "seoDescription"
  | "seoKeywords"
  | "isPublished"
  | "createdAt"
  | "updatedAt"
>;

export class CmsPage extends Model<ICmsPage, CmsPageCreation> implements ICmsPage {
  declare id: string;
  declare readonly _id: string;
  declare title: string;
  declare slug: string;
  declare type: PageType;
  declare summary: string | null;
  declare body: string;
  declare heroImageUrl: string | null;
  declare seoTitle: string | null;
  declare seoDescription: string | null;
  declare seoKeywords: string | null;
  declare isPublished: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

CmsPage.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: CmsPage) { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: CmsPage, value: string) {
        this.setDataValue("slug", value.trim().toLowerCase());
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PageType)),
      allowNull: false,
      defaultValue: PageType.LANDING
    },
    summary: DataTypes.TEXT,
    body: { type: DataTypes.TEXT, allowNull: false },
    heroImageUrl: DataTypes.TEXT,
    seoTitle: DataTypes.STRING,
    seoDescription: DataTypes.TEXT,
    seoKeywords: DataTypes.TEXT,
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "cms_pages" }
);
