import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  PageQuerySchema,
  PageQuery,
  PageCreateSchema,
  PageCreate,
} from "./page.schema";
import { PageService } from "./page.service";
import { authMiddleware } from "../../auth/authMiddleware2";

export const pageRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const service = new PageService();

  // GET /page
  fastify.get<{ Querystring: PageQuery }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Page"],
        summary: "取得頁面列表",
        description:
          "依照查詢參數取得頁面（Page）資源列表，例如後台頁面設定、菜單頁面設定等。",
        querystring: PageQuerySchema,
      },
    },
    async (req) => {
      const data = await service.list(req.query);
      return { status: "success", data, error: null };
    }
  );

  // POST /page
  fastify.post<{ Body: PageCreate }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Page"],
        summary: "新增頁面設定",
        description:
          "建立一個新的頁面（Page）資源，用於後台自訂頁面、動態頁面管理等場景。",
        body: PageCreateSchema,
      },
    },
    async (req) => {
      const data = await service.create(req.body);
      return { status: "success", data, error: null };
    }
  );
};
