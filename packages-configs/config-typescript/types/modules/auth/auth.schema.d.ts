import { Static } from "@sinclair/typebox";
export declare const loginSchema: import("@sinclair/typebox").TObject<{
    username: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
}>;
export type LoginBody = Static<typeof loginSchema>;
export declare const refreshSchema: import("@sinclair/typebox").TObject<{
    refreshToken: import("@sinclair/typebox").TString;
}>;
export type RefreshBody = Static<typeof refreshSchema>;
