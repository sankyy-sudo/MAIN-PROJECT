import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";

const authService = new AuthService();

const getParamValue = (value: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export class AuthController {
  async demoAdminLogin(_req: Request, res: Response) {
    try {
      const result = await authService.demoAdminLogin();
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.json({
        success: true,
        message: "Demo admin login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      return res.status(403).json({ success: false, message: error.message });
    }
  }

  async customerRegister(req: Request, res: Response) {
    try {
      const result = await authService.registerCustomer(
        req.body.name,
        req.body.email,
        req.body.password
      );
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.status(201).json({
        success: true,
        message: "Account created",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async customerLogin(req: Request, res: Response) {
    try {
      const result = await authService.loginCustomer(
        req.body.email,
        req.body.password,
        req.body.twoFactorCode
      );
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.json({
        success: true,
        message: "Login successful",
        data: { user: result.user, accessToken: result.accessToken }
      });
    } catch (error: any) {
      return res.status(401).json({ success: false, message: error.message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const result = await authService.register(
        name,
        email,
        password,
        role
      );

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(
        email,
        password,
        req.body.twoFactorCode
      );

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = await authService.getProfile(
        req.user!.id
      );

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async enableTwoFactor(req: Request, res: Response) {
    try {
      const data = await authService.enableTwoFactor(req.user!.id);
      return res.json({
        success: true,
        message: "Two-factor authentication enabled",
        data
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async disableTwoFactor(req: Request, res: Response) {
    try {
      const data = await authService.disableTwoFactor(req.user!.id);
      return res.json({
        success: true,
        message: "Two-factor authentication disabled",
        data
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  }

  async refresh(req: Request, res: Response) {
    try {
      const token =
        req.cookies.refreshToken ||
        req.body.refreshToken;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing"
        });
      }

      const result =
        await authService.refresh(token);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async forgotPassword(
    req: Request,
    res: Response
  ) {
    const resetToken =
      await authService.forgotPassword(
        req.body.email
      );

    return res.status(200).json({
      success: true,
      message:
        "If the email exists, reset instructions were generated",
      data: process.env.NODE_ENV === "production"
        ? undefined
        : { resetToken }
    });
  }

  async resetPassword(
    req: Request,
    res: Response
  ) {
    try {
      await authService.resetPassword(
        getParamValue(req.params.token),
        req.body.password
      );

      return res.status(200).json({
        success: true,
        message: "Password reset successful"
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const authController =
  new AuthController();
