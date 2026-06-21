"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_services_1 = require("../services/auth.services");
const authService = new auth_services_1.AuthService();
const getParamValue = (value) => Array.isArray(value) ? value[0] : value;
class AuthController {
    async customerRegister(req, res) {
        try {
            const result = await authService.registerCustomer(req.body.name, req.body.email, req.body.password);
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
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async customerLogin(req, res) {
        try {
            const result = await authService.loginCustomer(req.body.email, req.body.password, req.body.twoFactorCode);
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
        }
        catch (error) {
            return res.status(401).json({ success: false, message: error.message });
        }
    }
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const result = await authService.register(name, email, password, role);
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
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password, req.body.twoFactorCode);
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
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    async profile(req, res) {
        try {
            const user = await authService.getProfile(req.user.id);
            return res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async enableTwoFactor(req, res) {
        try {
            const data = await authService.enableTwoFactor(req.user.id);
            return res.json({
                success: true,
                message: "Two-factor authentication enabled",
                data
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async disableTwoFactor(req, res) {
        try {
            const data = await authService.disableTwoFactor(req.user.id);
            return res.json({
                success: true,
                message: "Two-factor authentication disabled",
                data
            });
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    async logout(req, res) {
        res.clearCookie("refreshToken");
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    }
    async refresh(req, res) {
        try {
            const token = req.cookies.refreshToken ||
                req.body.refreshToken;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token missing"
                });
            }
            const result = await authService.refresh(token);
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
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    async forgotPassword(req, res) {
        const resetToken = await authService.forgotPassword(req.body.email);
        return res.status(200).json({
            success: true,
            message: "If the email exists, reset instructions were generated",
            data: process.env.NODE_ENV === "production"
                ? undefined
                : { resetToken }
        });
    }
    async resetPassword(req, res) {
        try {
            await authService.resetPassword(getParamValue(req.params.token), req.body.password);
            return res.status(200).json({
                success: true,
                message: "Password reset successful"
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
