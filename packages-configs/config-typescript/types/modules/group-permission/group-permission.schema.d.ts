import { Static } from "@sinclair/typebox";
export declare const GroupPermissionsQuerySchema: import("@sinclair/typebox").TObject<{
    groupId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    pageId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type GroupPermissionsQuery = Static<typeof GroupPermissionsQuerySchema>;
export declare const GroupPermissionsCreateSchema: import("@sinclair/typebox").TObject<{
    groupId: import("@sinclair/typebox").TString;
    pageId: import("@sinclair/typebox").TString;
}>;
export type GroupPermissionsCreate = Static<typeof GroupPermissionsCreateSchema>;
export declare const TogglePermissionSchema: import("@sinclair/typebox").TObject<{
    groupId: import("@sinclair/typebox").TString;
    pageId: import("@sinclair/typebox").TString;
    permissionKey: import("@sinclair/typebox").TString;
}>;
export type TogglePermissionParams = Static<typeof TogglePermissionSchema>;
