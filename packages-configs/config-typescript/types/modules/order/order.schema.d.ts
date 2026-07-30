import { Static } from "@sinclair/typebox";
export declare const OrderGetParams: import("@sinclair/typebox").TObject<{}>;
export declare const orderQuerySchema: import("@sinclair/typebox").TObject<{
    orderId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    userId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAtFrom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    createdAtTo: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
export type OrderQuery = Static<typeof orderQuerySchema>;
