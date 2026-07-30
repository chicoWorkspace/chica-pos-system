import { PageAddParams } from "@repo/db/page/index.type";
import { Static } from "@sinclair/typebox";
export declare const PageQuerySchema: import("@sinclair/typebox").TObject<{
    key: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type PageQuery = Static<typeof PageQuerySchema>;
export declare const PermissionSchema: import("@sinclair/typebox").TObject<{
    key: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export declare const PageCreateSchema: import("@sinclair/typebox").TObject<{
    key: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    permissions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        key: import("@sinclair/typebox").TString;
        name: import("@sinclair/typebox").TString;
        description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
}>;
export type PageCreate = PageAddParams;
