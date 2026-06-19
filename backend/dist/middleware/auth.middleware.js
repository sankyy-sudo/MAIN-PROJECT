"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next();
    }
    try {
        const decoded = (0, jwt_1.verifyAccessToken)(authHeader.split(" ")[1]);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
    }
    catch {
        // Public endpoints remain accessible when an optional token is invalid.
    }
    return next();
};
exports.optionalAuthenticate = optionalAuthenticate;
