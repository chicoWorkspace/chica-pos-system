import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  AnnouncementAddParams,
  AnnouncementGetParams,
} from "@repo/api-client";
import { authMiddleware } from "../../auth/authMiddleware2";
import {
  addAnnouncementSchema,
  announcementQuerySchema,
} from "./announcement.schema";
import { AnnouncementService } from "./announcement.service";

export const announcementRoutes: FastifyPluginAsyncTypebox = async (
  fastify,
) => {
  const service = new AnnouncementService();

  fastify.get<{ Querystring: AnnouncementGetParams }>(
    "/",
    {
      schema: {
        tags: ["Announcement"],
        summary: "公告列表",
        description: "取得所有公告，支援依 type / isActive / createdAt 過濾。",
        querystring: announcementQuerySchema,
      },
    },
    async (request, reply) => {
      const query = request.query;
      const results = await service.list(query);
      return reply.send({ status: "success", data: results });
    },
  );

  fastify.post<{ Body: AnnouncementAddParams }>(
    "/",
    {
      // preHandler: [authMiddleware],
      schema: {
        tags: ["Announcement"],
        summary: "新增公告",
        description: "建立一則新的公告，包含標題、內容、類型等資訊。",
        body: addAnnouncementSchema,
      },
    },
    async (req) => {
      const body = req.body;
      const result = await service.add(body);

      fastify.io.emit("announcement:publish", [result.data]);

      return { status: "success", data: result.data, error: null };
    },
  );
};
