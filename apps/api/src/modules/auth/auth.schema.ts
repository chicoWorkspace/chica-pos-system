import { Type, Static } from "@sinclair/typebox";

// loginSchema
export const loginSchema = Type.Object(
  {
    username: Type.String(),
    password: Type.String(),
  },
  { additionalProperties: false } // 禁止額外屬性
);
export type LoginBody = Static<typeof loginSchema>;

// refreshSchema
export const refreshSchema = Type.Object(
  {
    refreshToken: Type.String(),
  },
  { additionalProperties: false }
);
export type RefreshBody = Static<typeof refreshSchema>;
