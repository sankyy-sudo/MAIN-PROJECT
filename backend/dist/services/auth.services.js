"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sequelize_1 = require("sequelize");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const email_1 = require("../utils/email");
class AuthService {
    async register(name, email, password, role) {
        const existingUser = await User_1.User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const user = await User_1.User.create({
            name,
            email,
            password: await bcryptjs_1.default.hash(password, 10),
            role: role || User_1.UserRole.ADMIN
        });
        return {
            user,
            accessToken: (0, jwt_1.generateAccessToken)(user),
            refreshToken: (0, jwt_1.generateRefreshToken)(user)
        };
    }
    async login(email, password) {
        const user = await User_1.User.scope("withPassword").findOne({
            where: { email: email.toLowerCase() }
        });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            throw new Error("Invalid credentials");
        }
        user.lastLogin = new Date();
        await user.save();
        return {
            user,
            accessToken: (0, jwt_1.generateAccessToken)(user),
            refreshToken: (0, jwt_1.generateRefreshToken)(user)
        };
    }
    async getProfile(userId) {
        return User_1.User.findByPk(userId);
    }
    async refresh(refreshToken) {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const user = await User_1.User.findByPk(decoded.id);
        if (!user) {
            throw new Error("User not found");
        }
        return {
            user,
            accessToken: (0, jwt_1.generateAccessToken)(user),
            refreshToken: (0, jwt_1.generateRefreshToken)(user)
        };
    }
    async forgotPassword(email) {
        const user = await User_1.User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return null;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
        await (0, email_1.sendTemplateEmail)(user.email, email_1.emailTemplates.passwordReset(`${frontendUrl}/reset-password/${resetToken}`));
        return resetToken;
    }
    async resetPassword(token, password) {
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = await User_1.User.scope("withPassword").findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { [sequelize_1.Op.gt]: new Date() }
            }
        });
        if (!user) {
            throw new Error("Invalid or expired reset token");
        }
        user.password = await bcryptjs_1.default.hash(password, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
        return user;
    }
}
exports.AuthService = AuthService;
