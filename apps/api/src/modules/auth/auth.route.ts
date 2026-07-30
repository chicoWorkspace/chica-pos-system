import { FastifyPluginAsync } from "fastify";
import {
  loginController,
  refreshController,
  permissionsController,
} from "./auth.controller";
import { authMiddleware } from "../../auth/authMiddleware2";
import { loginSchema, refreshSchema } from "./auth.schema";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

export const authRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "登入系統",
        description: "驗證帳號與密碼，成功後下發 JWT 與 Refresh Token。 <br>測試帳號: admin01, 密碼: abcd1234",
        body:loginSchema,
      },
    },
    loginController
  );

  fastify.post(
    "/refresh",
    {
      schema: {
        tags: ["Auth"],
        summary: "刷新 Token",
        description: "使用有效的 Refresh Token 重新取得新的 JWT。",
        body:refreshSchema,
      },
    },
    refreshController
  );

  fastify.get(
    "/permissions",
    {
      preHandler: authMiddleware,
      schema: {
        tags: ["Auth"],
        summary: "取得登入者的操作權限",
        description:
          "需要登入。回傳登入使用者所擁有的操作權限。",
      },
    },
    permissionsController
  );
};
