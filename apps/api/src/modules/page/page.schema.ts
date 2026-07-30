import { PageAddParams } from "@repo/db";
import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";

// GET /page querystring
export const PageQuerySchema = Type.Object({
  key: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
});

export type PageQuery = Static<typeof PageQuerySchema>;

// POST /page body
export const PermissionSchema = Type.Object({
  key: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
});

// 這邊用 PageAddParams 做 type，schema 仍要 TypeBox 定義
export const PageCreateSchema = Type.Object({
  key: Type.String(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  permissions: Type.Array(PermissionSchema, { minItems: 0 }),
});

export type PageCreate = PageAddParams; // <- 用 DB 定義的 interface