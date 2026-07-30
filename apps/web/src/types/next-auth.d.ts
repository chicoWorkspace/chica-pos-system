import { PagePermissions } from "@repo/api-client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;

    error?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: string; // leader, member
      permissions?: PagePermissions[];
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    role?: string; // leader, member
    permissions?: PagePermissions[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: string; // leader, member
    permissions?: PagePermissions[];
    error?: string;
  }
}
