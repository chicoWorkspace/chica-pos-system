import jwt from "jsonwebtoken";
import { GetEnvConfig } from "../utils";
import { AuthRequest } from "../types";
import { JwtPayload } from "../types/jwt";
const config = GetEnvConfig();
const JWT_SECRET = GetEnvConfig().JWT_SECRET ?? "supersecret";

export function authMiddleware(req: AuthRequest, res: any, next: any) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "未授權，缺少 token" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "未授權，token 有誤" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as JwtPayload; // 把解開的結果存到 req，後面 API 可以用
    next();
  } catch {
    res.status(403).json({ error: "Token 無效或過期" });
  }
}
