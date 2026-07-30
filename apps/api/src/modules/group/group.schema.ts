import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";
// GET /groups 不需要 body 或 params

// POST /group
export const GroupCreateSchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
});
export type GroupCreate = Static<typeof GroupCreateSchema>;

// PATCH /group/:groupId
export const GroupUpdateSchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
});
export type GroupUpdate = GroupCreate;

// POST /group/:groupId/members
export const GroupAddMemberSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type GroupAddMember = {
  username: string;
  password: string;
};

// DELETE /group/:groupId/members/:adminId 沒 body
// PATCH /group/:groupId/members/:adminId/leader 沒 body
