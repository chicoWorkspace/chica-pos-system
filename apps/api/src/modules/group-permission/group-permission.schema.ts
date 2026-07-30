// apps/api/src/features/group-permissions/schema.ts
import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";

//
// Query: GET /group-permissions
//
export const GroupPermissionsQuerySchema = Type.Object({
  groupId: Type.Optional(Type.String()),
  pageId: Type.Optional(Type.String()),
});
export type GroupPermissionsQuery = Static<typeof GroupPermissionsQuerySchema>;

//
// Body: POST /group
//
export const GroupPermissionsCreateSchema = Type.Object({
  groupId: Type.String({ minLength: 1 }),
  pageId: Type.String({ minLength: 1 }),
});
export type GroupPermissionsCreate = Static<
  typeof GroupPermissionsCreateSchema
>;

//
// Body: PATCH /group-permissions/toggle
//
export const TogglePermissionSchema = Type.Object({
  groupId: Type.String(),
  pageId: Type.String(),
  permissionKey: Type.String(),
});
export type TogglePermissionParams = Static<typeof TogglePermissionSchema>;
