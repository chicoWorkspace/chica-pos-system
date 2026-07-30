import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwt";
import { GetEnvConfig } from ".";

const config = GetEnvConfig();
const JWT_SECRET = config.JWT_SECRET;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;

const JWT_EXPIRES = config.JWT_EXPIRES; // access token 有效期 15 分鐘
const JWT_REFRESH_EXPIRES = config.JWT_REFRESH_EXPIRES; // refresh token 有效期 7 天

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
}
