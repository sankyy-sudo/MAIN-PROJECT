"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAccessSecret = () => {
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }
    return process.env.JWT_ACCESS_SECRET;
};
const getRefreshSecret = () => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not configured");
    }
    return process.env.JWT_REFRESH_SECRET;
};
const accessTokenOptions = {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES ||
        "15m")
};
const refreshTokenOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES ||
        "7d")
};
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, getAccessSecret(), accessTokenOptions);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, getRefreshSecret(), refreshTokenOptions);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getAccessSecret());
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getRefreshSecret());
};
exports.verifyRefreshToken = verifyRefreshToken;
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getAccessSecret(), { expiresIn: "15m" });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getRefreshSecret(), { expiresIn: "7d" });
};
exports.createRefreshToken = createRefreshToken;
