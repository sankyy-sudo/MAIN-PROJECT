"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = require("../utils/logger");
const errorHandler = (error, _req, res, _next) => {
    logger_1.logger.error(error.stack || error.message);
    if (error instanceof sequelize_1.ValidationError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.errors.map((item) => ({
                field: item.path,
                message: item.message
            }))
        });
    }
    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message
    });
};
exports.errorHandler = errorHandler;
