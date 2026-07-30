import {
  TSchema, //請勿移除!!! 要讓typescript推導這是所有 TypeBox 類型的基類
  Type,
} from "@sinclair/typebox";

export const StringUnion = <T extends readonly string[]>(values: T) => {
  return Type.Union(values.map((v) => Type.Literal(v)));
};
