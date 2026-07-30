import { OrderQuery } from "./order.schema";
export declare class OrderService {
    private orderFeature;
    list(filters: OrderQuery): Promise<import("@repo/db/order/index.type").IOrder[]>;
}
