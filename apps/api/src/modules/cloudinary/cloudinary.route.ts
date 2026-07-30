import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CloudinaryService } from "./cloudinary.service";
import {
  CloudinarySignatureBodySchema,
  CloudinarySignatureBody,
} from "./cloudinary.schema";
import { authMiddleware } from "../../auth/authMiddleware2";

export const cloudinaryRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const service = new CloudinaryService();

  fastify.post<{ Body: CloudinarySignatureBody }>(
    "/signature",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Cloudinary"],
        summary: "生成 Cloudinary 上傳簽章",
        description:
          "產生 Cloudinary 上傳所需的簽章（signature）、timestamp、folder 等參數，用於讓前端能直接安全上傳檔案至 Cloudinary。",
        body: CloudinarySignatureBodySchema,
      },
    },
    async (req) => {
      const result = await service.generateSignature(req.body);
      return {
        status: "success",
        data: result,
        error: null,
      };
    }
  );
};
