import { CartTableResult } from "@repo/api-client";
export declare class CartService {
    private cartFeature;
    private photoFeature;
    private productFeature;
    formatCart(userId: string): Promise<CartTableResult>;
    reFreshCart(userId: string): Promise<void>;
    cartUpdate(userId: string, specId: string, quantity: number): Promise<void>;
    getCart(userId: string): Promise<CartTableResult>;
    getCartData(userId: string): Promise<import("@repo/db/cart/index.type").ICart>;
}
