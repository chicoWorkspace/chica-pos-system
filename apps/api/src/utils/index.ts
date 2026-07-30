/* eslint-disable turbo/no-undeclared-env-vars */
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { v1 as uuidv1 } from "uuid";

// Load local overrides first
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
// Fallback to default .env
dotenv.config();

interface IEnvConfig {
  PORT: number;
  DEFAULT_WEBSITE_ID: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES: string;
  JWT_REFRESH_EXPIRES: string;
  NODE_ENV: string;

  REDIS_HOST:string;
  REDIS_PASSWORD:string;
  REDIS_PORT:string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  TIP_RATE: number;
}

export function GetEnvConfig() {
  const result: IEnvConfig = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    DEFAULT_WEBSITE_ID: process.env.DEFAULT_WEBSITE_ID ?? "test_fulldarts",
    JWT_SECRET: process.env.JWT_SECRET ?? "supersecret",
    JWT_REFRESH_SECRET: process.env.JWT_SECRET ?? "refreshsecret",
    JWT_EXPIRES: process.env.JWT_EXPIRES ?? "15m",
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES ?? "7d",
    NODE_ENV: process.env.NODE_ENV ?? "development",

    REDIS_HOST :process.env.REDIS_HOST ??"127.0.0.1",
    REDIS_PASSWORD:process.env.REDIS_PASSWORD ??'test',
    REDIS_PORT:process.env.REDIS_PORT ??'6379',

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "development",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "development",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "development",

    TIP_RATE: process.env.TIP_RATE ? parseFloat(process.env.TIP_RATE) : 0,
  };

  return result;
}
export class PasswordHash {
  static saltRounds = 10;

  public static getHash(password: string) {
    const hash = bcrypt.hashSync(password, PasswordHash.saltRounds);
    return hash;
  }

  public static compare(password: string, hashedPassword: string) {
    const result = bcrypt.compareSync(password, hashedPassword);
    return result;
  }
}

export function getUUID() {
  return uuidv1();
}
