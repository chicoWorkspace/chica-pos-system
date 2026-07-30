import { CartTableResult } from "@repo/api-client";
declare const router: import("express-serve-static-core").Router;
export declare function formatCart(userId: string): Promise<CartTableResult>;
export { router as CartRouter };
