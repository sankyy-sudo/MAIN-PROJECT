"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = exports.UserRole = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SALES_MANAGER"] = "SALES_MANAGER";
    UserRole["INVENTORY_MANAGER"] = "INVENTORY_MANAGER";
    UserRole["SUPPORT"] = "SUPPORT";
    UserRole["CUSTOMER"] = "CUSTOMER";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class User extends sequelize_1.Model {
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    _id: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return this.getDataValue("id");
        }
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue("email", value.trim().toLowerCase());
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: { len: [6, 255] }
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.ADMIN
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(UserStatus)),
        allowNull: false,
        defaultValue: UserStatus.ACTIVE
    },
    avatar: sequelize_1.DataTypes.STRING,
    lastLogin: sequelize_1.DataTypes.DATE,
    passwordResetToken: sequelize_1.DataTypes.STRING,
    passwordResetExpires: sequelize_1.DataTypes.DATE,
    failedLoginAttempts: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    lockUntil: sequelize_1.DataTypes.DATE,
    twoFactorEnabled: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    twoFactorSecret: sequelize_1.DataTypes.STRING,
    businessAccountId: sequelize_1.DataTypes.UUID,
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, {
    sequelize: database_1.sequelize,
    tableName: "users",
    defaultScope: { attributes: { exclude: ["password"] } },
    scopes: { withPassword: { attributes: { include: ["password"] } } }
});
