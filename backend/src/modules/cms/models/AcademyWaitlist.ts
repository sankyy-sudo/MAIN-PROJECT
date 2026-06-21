import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/database";

export interface IAcademyWaitlist {
  id: string;
  readonly _id: string;
  name: string;
  email: string;
  company?: string | null;
  interest?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type AcademyWaitlistCreation = Optional<
  IAcademyWaitlist,
  "id" | "_id" | "company" | "interest" | "createdAt" | "updatedAt"
>;

export class AcademyWaitlist
  extends Model<IAcademyWaitlist, AcademyWaitlistCreation>
  implements IAcademyWaitlist
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare email: string;
  declare company: string | null;
  declare interest: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AcademyWaitlist.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    _id: { type: DataTypes.VIRTUAL, get(this: AcademyWaitlist) { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: AcademyWaitlist, value: string) {
        this.setDataValue("email", value.trim().toLowerCase());
      }
    },
    company: DataTypes.STRING,
    interest: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  { sequelize, tableName: "cms_academy_waitlist" }
);
