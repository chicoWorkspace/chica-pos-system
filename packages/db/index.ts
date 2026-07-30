import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { eDateTime } from "@repo/lib";
import { Group } from "./src/group";

interface IEnvConfig {
  PORT: number;
  WEBSITE_ID: string;
  JWT_SECRET: string;
  MONGODB_URL: string;
  MONGODB_DBNAME: string;
}

export function GetEnvConfig() {
  const result: IEnvConfig = {
    JWT_SECRET: process.env.JWT_SECRET ?? "123456",
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    WEBSITE_ID: process.env.WEBSITE_ID ?? "local_test",
    MONGODB_URL:
      process.env.MONGODB_URL ??
      "mongodb://root:123456@mongo01:27017,mongo02:27018,mongo03:27019/?replicaSet=mongo-replica-set",
    MONGODB_DBNAME: process.env.MONGODB_DBNAME ?? "db",
  };

  return result;
}

export class JwtToken {
  public static get(id: string) {
    const secret = GetEnvConfig().JWT_SECRET;

    const now = eDateTime.now().getTimestamp();
    const input_id = `${id}@@@${now}`;

    const token = jwt.sign({ id: input_id }, secret, {
      expiresIn: 60 * 60 * 24 * 30,
    });
    return token;
  }
  public static verify(token: string) {
    const secret = GetEnvConfig().JWT_SECRET;
    const result_src = jwt.verify(token, secret) as {
      id: string;
      iat: number;
      exp: number;
    };
    const data = result_src.id.split("@@@");
    const result = {
      id: data[0],
      time: data[1],
      iat: result_src.iat,
      exp: result_src.exp,
    };

    return result;
  }
}

export async function connectToDatabase() {
  const config = GetEnvConfig();
  const dbUri = config.MONGODB_URL;

  try {
    await mongoose.connect(dbUri, {
      readPreference: "primaryPreferred",
      dbName: config.MONGODB_DBNAME,
    });
    const groupFeature = new Group();
    await groupFeature.initalData();
    console.log("成功連接到資料庫:", config.MONGODB_DBNAME);
  } catch (error) {
    console.error("資料庫連接失敗：", error);
  }
}
