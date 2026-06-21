import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum ContentPostType {
  BLOG = "BLOG",
  NEWS = "NEWS",
  RECIPE = "RECIPE"
}

export interface IContentPost {
  id: string;
  readonly _id: string;
  title: string;
  slug: string;
  type: ContentPostType;
  excerpt?: string | null;
  body: string;
  imageUrl?: string | null;
  authorName?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type ContentPostCreation = Optional<
  IContentPost,
  | "id"
  | "_id"
  | "excerpt"
  | "imageUrl"
  | "authorName"
  | "seoTitle"
  | "seoDescription"
  | "isPublished"
  | "publishedAt"
  | "createdAt"
  | "updatedAt"
>;

export class ContentPost
  extends Model<IContentPost, ContentPostCreation>
  implements IContentPost
{
  declare id: string;
  declare readonly _id: string;
  declare title: string;
  declare slug: string;
  declare type: ContentPostType;
  declare excerpt: string | null;
  declare body: string;
  declare imageUrl: string | null;
  declare authorName: string | null;
  declare seoTitle: string | null;
  declare seoDescription: string | null;
  declare isPublished: boolean;
  declare publishedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ContentPost.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: ContentPost) { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: ContentPost, value: string) {
        this.setDataValue("slug", value.trim().toLowerCase());
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ContentPostType)),
      allowNull: false
    },
    excerpt: DataTypes.TEXT,
    body: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: DataTypes.TEXT,
    authorName: DataTypes.STRING,
    seoTitle: DataTypes.STRING,
    seoDescription: DataTypes.TEXT,
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    publishedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "cms_content_posts" }
);
