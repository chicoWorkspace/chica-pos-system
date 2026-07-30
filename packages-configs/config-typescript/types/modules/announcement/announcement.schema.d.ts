import { Static } from "@sinclair/typebox";
export declare const AnnouncementGetParams: import("@sinclair/typebox").TObject<{}>;
export declare const announcementQuerySchema: import("@sinclair/typebox").TObject<{
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnsafe<"success" | "warning" | "info" | "critical">>;
    isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    createdAtFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAtTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    sortBy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"createdAt">, import("@sinclair/typebox").TLiteral<"title">, import("@sinclair/typebox").TLiteral<"type">]>>;
    sortOrder: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"asc">, import("@sinclair/typebox").TLiteral<"desc">]>>;
}>;
export type AnnouncementQuery = Static<typeof announcementQuerySchema>;
export declare const addAnnouncementSchema: import("@sinclair/typebox").TObject<{
    title: import("@sinclair/typebox").TString;
    content: import("@sinclair/typebox").TString;
    type: import("@sinclair/typebox").TUnion<import("@sinclair/typebox").TLiteral<string>[]>;
    link: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        action: import("@sinclair/typebox").TUnion<import("@sinclair/typebox").TLiteral<string>[]>;
        url: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        label: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        target: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"_blank">, import("@sinclair/typebox").TLiteral<"_self">]>>;
        params: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TAny>>;
    }>>;
    isActive: import("@sinclair/typebox").TBoolean;
}>;
export type AddAnnouncementBody = Static<typeof addAnnouncementSchema>;
