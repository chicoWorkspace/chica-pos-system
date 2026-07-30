import { GetEnvConfig } from "@/src";
import { getAuthApi } from "@/src/api-client/auth";
import { RefreshResult } from "@repo/api-client";
import NextAuth, { type NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

const accessTokenExpiresSec = 100;

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt", // 或 "database"
    maxAge: 1 * 24 * 60 * 60, // 30 天
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.username || !credentials.password) {
          return null;
        }
        try {
          const api = await getAuthApi();

          const res = await api.login({
            username: credentials.username as string,
            password: credentials.password as string,
          });

          if (!res || !res.accessToken || !res.refreshToken) {
            throw new Error("登入失敗，請檢查帳號密碼");
          }

          if (res.permissions.length === 0) {
            throw new Error("無權限進入, 請聯繫主管");
          }

          //操作權限存到redux state
          // const dispatch = useAppDispatch();
          // dispatch(setPermissions(res.permissions));

          return {
            id: credentials.username as string,
            name: credentials.username as string,
            role: res.role,
            permissions: res.permissions,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          };
        } catch (err: any) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // 自訂登入頁
  },
  callbacks: {
    async jwt({ token, user }) {
      // 第一次登入會有 user
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.name = user.name;
        token.role = user.role;
        token.permissions = user.permissions;
        token.accessTokenExpires = Date.now() + accessTokenExpiresSec * 1000; // 假設 accessToken 1小時過期
      }

      if (!token.accessToken) {
        return token;
      }

      // accessToken 還沒過期 → 直接回傳
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 過期 → 嘗試 refresh
      const refreshed = await refreshAccessToken(token);

      // 確保 error 一定寫進 JWT
      return refreshed;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.user.role = token.role;
      session.user.permissions = token.permissions;
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
};

async function refreshAccessToken(token: any): Promise<JWT> {
  const config = await GetEnvConfig();

  try {

    const data = await fetch(`${config.API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    interface resutlt {
      status: "string";
      error: null | string;
      data: RefreshResult | null;
    }

    if (!data) throw new Error("Failed to refresh token");

    const res: resutlt = await data.json();

    if (!res.data?.accessToken) {
      throw res;
    }

    return {
      ...token,
      accessToken: res.data.accessToken,
      accessTokenExpires: Date.now() + accessTokenExpiresSec * 1000, // 重新設定過期時間
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
