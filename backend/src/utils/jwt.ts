import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../models/User";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  businessAccountId?: string | null;
}

const getAccessSecret = (): string => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }

  return process.env.JWT_ACCESS_SECRET;
};

const getRefreshSecret = (): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not configured");
  }

  return process.env.JWT_REFRESH_SECRET;
};

const accessTokenOptions: SignOptions = {
  expiresIn:
    (process.env.JWT_ACCESS_EXPIRES ||
      "15m") as SignOptions["expiresIn"]
};

const refreshTokenOptions: SignOptions = {
  expiresIn:
    (process.env.JWT_REFRESH_EXPIRES ||
      "7d") as SignOptions["expiresIn"]
};

export const generateAccessToken = (
  user: IUser
): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      businessAccountId: user.businessAccountId
    },
    getAccessSecret(),
    accessTokenOptions
  );
};

export const generateRefreshToken = (
  user: IUser
): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      businessAccountId: user.businessAccountId
    },
    getRefreshSecret(),
    refreshTokenOptions
  );
};

export const verifyAccessToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    getAccessSecret()
  ) as JwtPayload;
};

export const verifyRefreshToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    getRefreshSecret()
  ) as JwtPayload;
};
export const createAccessToken = (
  payload: any
) => {
  return jwt.sign(
    payload,
    getAccessSecret(),
    { expiresIn: "15m" }
  );
};

export const createRefreshToken = (
  payload: any
) => {
  return jwt.sign(
    payload,
    getRefreshSecret(),
    { expiresIn: "7d" }
  );
};
