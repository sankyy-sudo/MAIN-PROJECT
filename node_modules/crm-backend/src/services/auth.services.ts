import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Op } from "sequelize";
import { User, UserRole } from "../models/User";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";
import { emailTemplates, sendTemplateEmail } from "../utils/email";

export class AuthService {
  async register(name: string, email: string, password: string, role?: string) {
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: (role as UserRole) || UserRole.ADMIN
    });

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async login(email: string, password: string) {
    const user = await User.scope("withPassword").findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    user.lastLogin = new Date();
    await user.save();

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async getProfile(userId: string) {
    return User.findByPk(userId);
  }

  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return null;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    await sendTemplateEmail(
      user.email,
      emailTemplates.passwordReset(
        `${frontendUrl}/reset-password/${resetToken}`
      )
    );

    return resetToken;
  }

  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.scope("withPassword").findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return user;
  }
}
