import { Static } from "@sinclair/typebox";
export declare const orderSchema: import("@sinclair/typebox").TObject<{
    paymentMethod: import("@sinclair/typebox").TString;
}>;
export type OrderBody = Static<typeof orderSchema>;
export declare const updateCartSchema: import("@sinclair/typebox").TObject<{
    quantity: import("@sinclair/typebox").TNumber;
}>;
export type UpdateCartBody = Static<typeof updateCartSchema>;
export declare const specIdParamSchema: import("@sinclair/typebox").TObject<{
    specId: import("@sinclair/typebox").TString;
}>;
export type SpecIdParam = Static<typeof specIdParamSchema>;
