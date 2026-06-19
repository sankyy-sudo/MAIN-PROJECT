import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SALES_MANAGER = "SALES_MANAGER",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  SUPPORT = "SUPPORT"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED"
}

export interface IUser {
  id: string;
  readonly _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string | null;
  lastLogin?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type UserCreationAttributes = Optional<
  IUser,
  | "id"
  | "_id"
  | "role"
  | "status"
  | "avatar"
  | "lastLogin"
  | "passwordResetToken"
  | "passwordResetExpires"
  | "createdAt"
  | "updatedAt"
>;

export class User
  extends Model<IUser, UserCreationAttributes>
  implements IUser
{
  declare id: string;
  declare readonly _id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare status: UserStatus;
  declare avatar: string | null;
  declare lastLogin: Date | null;
  declare passwordResetToken: string | null;
  declare passwordResetExpires: Date | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  toJSON() {
    const values = { ...this.get() } as Record<string, unknown>;
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    _id: {
      type: DataTypes.VIRTUAL,
      get(this: User) {
        return this.getDataValue("id");
      }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(this: User, value: string) {
        this.setDataValue("email", value.trim().toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 255] }
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
      defaultValue: UserRole.ADMIN
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.ACTIVE
    },
    avatar: DataTypes.STRING,
    lastLogin: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: "users",
    defaultScope: { attributes: { exclude: ["password"] } },
    scopes: { withPassword: { attributes: { include: ["password"] } } }
  }
);
