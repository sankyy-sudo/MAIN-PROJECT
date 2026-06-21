import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export enum SubscriberStatus {
  SUBSCRIBED = "SUBSCRIBED",
  UNSUBSCRIBED = "UNSUBSCRIBED"
}

export interface INewsletterSubscriber {
  id: string;
  readonly _id: string;
  email: string;
  name?: string | null;
  source?: string | null;
  status: SubscriberStatus;
  unsubscribeToken: string;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type NewsletterSubscriberCreation = Optional<
  INewsletterSubscriber,
  | "id"
  | "_id"
  | "name"
  | "source"
  | "status"
  | "subscribedAt"
  | "unsubscribedAt"
  | "createdAt"
  | "updatedAt"
>;

export class NewsletterSubscriber
  extends Model<INewsletterSubscriber, NewsletterSubscriberCreation>
  implements INewsletterSubscriber
{
  declare id: string;
  declare readonly _id: string;
  declare email: string;
  declare name: string | null;
  declare source: string | null;
  declare status: SubscriberStatus;
  declare unsubscribeToken: string;
  declare subscribedAt: Date;
  declare unsubscribedAt: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

NewsletterSubscriber.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: NewsletterSubscriber) { return this.id; } },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: NewsletterSubscriber, value: string) {
        this.setDataValue("email", value.trim().toLowerCase());
      }
    },
    name: DataTypes.STRING,
    source: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(...Object.values(SubscriberStatus)),
      allowNull: false,
      defaultValue: SubscriberStatus.SUBSCRIBED
    },
    unsubscribeToken: { type: DataTypes.STRING, allowNull: false },
    subscribedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    unsubscribedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "newsletter_subscribers" }
);
