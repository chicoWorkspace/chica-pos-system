import { Static } from "@sinclair/typebox";
export declare const categoryQuerySchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type CategoryQuery = Static<typeof categoryQuerySchema>;
export declare const categoryBodySchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    icon: import("@sinclair/typebox").TString;
    order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export type CategoryCreate = Static<typeof categoryBodySchema>;
export declare const categoryUpdateSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    icon: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export type CategoryUpdate = Static<typeof categoryUpdateSchema>;
export declare const categoryIdParamSchema: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
}>;
export type CategoryIdParam = Static<typeof categoryIdParamSchema>;
