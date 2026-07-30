import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  GroupCreateSchema,
  GroupCreate,
  GroupUpdateSchema,
  GroupUpdate,
  GroupAddMemberSchema,
  GroupAddMember,
} from "./group.schema";
import { GroupService } from "./group.service";
import { authMiddleware } from "../../auth/authMiddleware2";

export const groupRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  const service = new GroupService();

  // GET /groups
  fastify.get(
    "/groups",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "取得群組列表",
        description: "回傳所有群組（含成員資訊）。",
      },
    },
    async () => {
      const data = await service.listGroups();
      return { status: "success", data, error: null };
    }
  );

  // POST /group
  fastify.post<{ Body: GroupCreate }>(
    "/",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "新增群組",
        description: "建立一個新的權限群組。",
        body: GroupCreateSchema,
      },
    },
    async (req) => {
      const data = await service.create(req.body);
      return { status: "success", data, error: null };
    }
  );

  // PATCH /group/:groupId
  fastify.patch<{ Body: GroupUpdate; Params: { groupId: string } }>(
    "/:groupId",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "更新群組資訊",
        description: "依照 groupId 更新群組名稱或權限設定。",
        body: GroupUpdateSchema,
      },
    },
    async (req) => {
      const data = await service.update(req.params.groupId, req.body);
      return { status: "success", data, error: null };
    }
  );

  // POST /group/:groupId/members
  fastify.post<{ Body: GroupAddMember; Params: { groupId: string } }>(
    "/:groupId/members",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "新增群組成員",
        description: "將管理員加入指定群組。",
        body: GroupAddMemberSchema,
      },
    },
    async (req) => {
      const data = await service.addMember(req.params.groupId, req.body);
      return { status: "success", data, error: null };
    }
  );

  // DELETE /group/:groupId
  fastify.delete<{ Params: { groupId: string } }>(
    "/:groupId",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "刪除群組",
        description: "移除指定 groupId 的群組。",
      },
    },
    async (req) => {
      const data = await service.deleteGroup(req.params.groupId);
      return { status: "success", data, error: null };
    }
  );

  // DELETE /group/:groupId/members/:adminId
  fastify.delete<{ Params: { groupId: string; adminId: string } }>(
    "/:groupId/members/:adminId",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "移除群組成員",
        description: "從群組移除某位管理員。",
      },
    },
    async (req) => {
      const data = await service.removeMember(
        req.params.groupId,
        req.params.adminId
      );
      return { status: "success", data, error: null };
    }
  );

  // PATCH /group/:groupId/members/:adminId/leader
  fastify.patch<{ Params: { groupId: string; adminId: string } }>(
    "/:groupId/members/:adminId/leader",
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ["Group"],
        summary: "設定群組組長",
        description: "將 adminId 設為指定群組的組長。",
      },
    },
    async (req) => {
      const data = await service.setLeader(
        req.params.groupId,
        req.params.adminId
      );
      return { status: "success", data, error: null };
    }
  );
};
