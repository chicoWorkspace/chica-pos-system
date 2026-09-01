// apps/api/src/features/group-permissions/route.ts

import {
  FastifyPluginAsyncTypebox,
  TypeBoxTypeProvider,
} from "@fastify/type-provider-typebox";
import {
  GroupPermissionsQuerySchema,
  GroupPermissionsCreateSchema,
  TogglePermissionSchema,
  GroupPermissionsCreate,
  TogglePermissionParams,
} from "./group-permission.schema";
import { GroupPermissionsService } from "./group-permission.service";
import { authMiddleware } from "../../auth/authMiddleware2";

function createHttpError(statusCode: number, message: string) {
  return Object.assign(new Error(message), { statusCode });
}

export const groupPermissionsRoutes: FastifyPluginAsyncTypebox = async (
  fastify
) => {
  const service = new GroupPermissionsService();

  //
  // GET /group-permissions
  //
  fastify.get(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["GroupPermission"],
        summary: "取得群組權限列表",
        description: "根據查詢條件回傳群組的權限設定，用於後台權限管理顯示。",
        querystring: GroupPermissionsQuerySchema,
      },
    },
    async (req) => {
      const result = await service.list(req.query);
      return {
        status: "success",
        data: result,
        error: null,
      };
    }
  );

  //
  // POST /group
  //
  fastify.post<{ Body: GroupPermissionsCreate }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["GroupPermission"],
        summary: "新增群組的權限設定",
        description: "用於建立某個群組的初始權限。",
        body: GroupPermissionsCreateSchema,
      },
    },
    async (req) => {
      const body = req.body;
      const result = await service.create(body);
      return {
        status: "success",
        data: result,
        error: null,
      };
    }
  );

  //
  // PATCH /group-permissions/toggle
  //
  fastify.patch<{ Body: TogglePermissionParams }>(
    "/toggle",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["GroupPermission"],
        summary: "切換指定權限（啟用/停用）",
        description:
          "快速切換某群組特定權限。例如：啟用或關閉某個 route 或 action 的權限。",
        body: TogglePermissionSchema,
      },
    },
    async (req) => {
      try {
        const result = await service.toggle(req.body);
        return {
          status: "success",
          data: result.data,
          error: null,
        };
      } catch {
        throw createHttpError(400, "權限更新失敗");
      }
    }
  );
};
