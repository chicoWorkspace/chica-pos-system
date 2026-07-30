import { Type } from "@sinclair/typebox";

export const CloudinarySignatureBodySchema = Type.Object({
  folder: Type.Optional(Type.String({ default: "image" })),
});

export type CloudinarySignatureBody = {
  folder?: string;
};
