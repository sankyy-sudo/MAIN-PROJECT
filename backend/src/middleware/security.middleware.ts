import crypto from "crypto";
import { NextFunction, Request, Response } from "express";

const unsafeMethods = ["POST", "PUT", "PATCH", "DELETE"];
const csrfCookieName = "csrfToken";
const csrfHeaderName = "x-csrf-token";

export const issueCsrfToken = (_req: Request, res: Response) => {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie(csrfCookieName, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000
  });
  return res.json({ success: true, data: { csrfToken: token } });
};

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.CSRF_PROTECTION_ENABLED !== "true") return next();
  if (!unsafeMethods.includes(req.method)) return next();
  if (req.path === "/api/payments/webhook") return next();

  const cookieToken = req.cookies?.[csrfCookieName];
  const headerToken = req.headers[csrfHeaderName];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token"
    });
  }
  return next();
};

export const adminRoutePrefix = () =>
  process.env.ADMIN_ROUTE_PREFIX || "admin-console";
