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
  async demoAdminLogin() {
    if (
      process.env.DEMO_ADMIN_LOGIN_ENABLED !== "true" &&
      process.env.NODE_ENV === "production"
    ) {
      throw new Error("Demo admin login is disabled");
    }

    const email = process.env.DEMO_ADMIN_EMAIL || "demo.admin@cotecae.com";
    const password = process.env.DEMO_ADMIN_PASSWORD || "demoAdmin123";
    const [user, created] = await User.findOrCreate({
      where: { email: email.toLowerCase() },
      defaults: {
        name: "Demo Super Admin",
        email,
        password: await bcrypt.hash(password, 10),
        role: UserRole.SUPER_ADMIN
      }
    });

    if (!created) {
      await user.update({
        role: UserRole.SUPER_ADMIN,
        failedLoginAttempts: 0,
        lockUntil: null,
        twoFactorEnabled: false,
        twoFactorSecret: null
      });
    }

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async registerCustomer(name: string, email: string, password: string) {
    const existing = await User.findOne({
      where: { email: email.toLowerCase() }
    });
    if (existing) throw new Error("Email already registered");

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: UserRole.CUSTOMER
    });
    await sendTemplateEmail(
      user.email,
      emailTemplates.welcomeEmail(user)
    );
    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  async loginCustomer(email: string, password: string, twoFactorCode?: string) {
    const result = await this.login(email, password, twoFactorCode);
    if (result.user.role !== UserRole.CUSTOMER) {
      throw new Error("Customer account required");
    }
    return result;
  }

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

  async login(email: string, password: string, twoFactorCode?: string) {
    const user = await User.scope("withPassword").findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new Error("Account is temporarily locked");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      const failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.update({
        failedLoginAttempts,
        lockUntil:
          failedLoginAttempts >= Number(process.env.ACCOUNT_LOCKOUT_ATTEMPTS || 5)
            ? new Date(Date.now() + Number(process.env.ACCOUNT_LOCKOUT_MINUTES || 15) * 60 * 1000)
            : null
      });
      throw new Error("Invalid credentials");
    }
    if (user.twoFactorEnabled && !this.verifyTwoFactorCode(user, twoFactorCode)) {
      throw new Error("Two-factor code required");
    }

    user.lastLogin = new Date();
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    return {
      user,
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  }

  generateTwoFactorCode(user: User) {
    if (!user.twoFactorSecret) return null;
    const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
    return crypto
      .createHmac("sha256", user.twoFactorSecret)
      .update(String(bucket))
      .digest("hex")
      .slice(0, 6)
      .toUpperCase();
  }

  verifyTwoFactorCode(user: User, code?: string) {
    if (!code) return false;
    const current = this.generateTwoFactorCode(user);
    return current === code.trim().toUpperCase();
  }

  async enableTwoFactor(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    const secret = crypto.randomBytes(24).toString("hex");
    await user.update({ twoFactorSecret: secret, twoFactorEnabled: true });
    return {
      enabled: true,
      secret,
      currentCode: process.env.NODE_ENV === "production" ? undefined : this.generateTwoFactorCode(user)
    };
  }

  async disableTwoFactor(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    await user.update({ twoFactorEnabled: false, twoFactorSecret: null });
    return { enabled: false };
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
