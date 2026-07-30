import { headers } from "next/headers";

interface IEnvConfig {
  JWT_SECRET: string;

  API_URL: string;
  STORAGE_BUCKET_ID: string;
  SESSION_SECRET: string;
  WEB_DOMAIN: string;
  ADMIN_DOMAIN: string;
}

export async function GetEnvConfig() {
  "use server";

  const result: IEnvConfig = {
    JWT_SECRET: process.env.JWT_SECRET ?? "123456",
    API_URL: process.env.API_URL ?? "http://yourapidomain/admin",
    STORAGE_BUCKET_ID: process.env.STORAGE_BUCKET_ID ?? "",
    SESSION_SECRET:
      process.env.SESSION_SECRET ??
      "KrGz61DwKQ2u/HE72G2EtlgW1O3qdSicRd8kh41XkwE=",
    WEB_DOMAIN: process.env.WEB_DOMAIN ?? "web.mywebsite.com",
    ADMIN_DOMAIN: process.env.ADMIN_DOMAIN ?? "admin.mywebsite.com",
  };

  return result;
}

export async function getHost() {
  const headerList = await headers();
  const result = headerList.get("ex-host") ?? "localhost";
  return result;
}

export async function getPathname() {
  const headerList = await headers();
  const result = headerList.get("ex-pathname") ?? "/";
  return result;
}
