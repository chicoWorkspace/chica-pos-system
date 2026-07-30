// apps/api/src/features/category/route.ts
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { CategoryService } from "./category.service";
import {
  categoryQuerySchema,
  categoryBodySchema,
  categoryIdParamSchema,
  categoryUpdateSchema,
  CategoryQuery,
  CategoryCreate,
  CategoryUpdate,
} from "./category.schema";
import { authMiddleware } from "../../auth/authMiddleware2";
import { CategoryGetParams } from "@repo/db";

export const categoryRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const service = new CategoryService();

  fastify.get<{ Querystring: CategoryQuery }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Category"],
        summary: "分類列表",
        description: "取得所有分類，支援依 id / name 過濾。",
        querystring: categoryQuerySchema,
      },
    },
    async (req) => {
      const filter: CategoryGetParams = {};

      if (req.query.id) filter._id = req.query.id;
      if (req.query.name) filter.name = req.query.name;

      const data = await service.list(filter);

      const result = data.map((item) => ({
        ...item,
        _id: item._id.toString(),
      }));
      return { status: "success", data: result, error: null };
    }
  );

  fastify.post<{ Body: CategoryCreate }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Category"],
        summary: "新增分類",
        description: "建立一個新的分類（自動處理排序 order）。",
        body: categoryBodySchema,
      },
    },
    async (req) => {
      const body = req.body;
      const params = {
        name: body.name.trim(),
        icon: body.icon.trim(),
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      };

      if (body.order === undefined) {
        const maxOrderDoc = await service.list({}, { order: -1 });
        params.order = maxOrderDoc.length === 0 ? 1 : maxOrderDoc[0].order + 1;
      }

      const newCategory = await service.add(params);
      return { status: "success", data: newCategory, error: null };
    }
  );

  fastify.patch<{ Params: { id: string }; Body: CategoryUpdate }>(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Category"],
        summary: "更新分類",
        description: "依據分類 ID 更新分類資料。",
        body: categoryUpdateSchema,
      },
    },
    async (req) => {
      const params: Partial<CategoryUpdate> = {};
      const body = req.body;

      if (body.name !== undefined) params.name = body.name;
      if (body.icon !== undefined) params.icon = body.icon;
      if (body.isActive !== undefined) params.isActive = body.isActive;

      const updated = await service.update(req.params.id, params);
      if (!updated) return { status: "error", data: null, error: "分類不存在" };
      return { status: "success", data: updated, error: null };
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Category"],
        summary: "刪除分類",
        description: "依據分類 ID 刪除分類。",
        params: categoryIdParamSchema,
      },
    },
    async (req) => {
      const deleted = await service.delete(req.params.id);
      return { status: "success", data: deleted, error: null };
    }
  );
};
