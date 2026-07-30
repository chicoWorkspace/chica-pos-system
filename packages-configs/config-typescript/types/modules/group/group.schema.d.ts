import { Static } from "@sinclair/typebox";
export declare const GroupCreateSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type GroupCreate = Static<typeof GroupCreateSchema>;
export declare const GroupUpdateSchema: import("@sinclair/typebox").TObject<{
    name: import("@sinclair/typebox").TString;
    description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type GroupUpdate = GroupCreate;
export declare const GroupAddMemberSchema: import("@sinclair/typebox").TObject<{
    username: import("@sinclair/typebox").TString;
    password: import("@sinclair/typebox").TString;
}>;
export type GroupAddMember = {
    username: string;
    password: string;
};
