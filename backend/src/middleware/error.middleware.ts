import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
import { logger } from "../utils/logger";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(error.stack || error.message);

  if (error instanceof ValidationError) {
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
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message
  });
};
