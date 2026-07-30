import { ProductGetParams } from "@repo/api-client";
import { FilterQuery } from "mongoose";
import { CreateProductRequest, UpdateProductRequest } from "./product.schema";
export declare class ProductService {
    private productFeature;
    private specFeature;
    private photoFeature;
    create(payload: CreateProductRequest): Promise<import("@repo/db/product/index.model").ModelProduct>;
    update(payload: UpdateProductRequest): Promise<import("@repo/db/product/index.model").ModelProduct>;
    delete(id: string): Promise<import("@repo/db/product/index.model").ModelProduct>;
    list(filter: FilterQuery<ProductGetParams>): Promise<import("@repo/db/product/index.type").ProductInList[]>;
    deleteSpec(productId: string, specId: string): Promise<import("@repo/db/spec-inventory/index.model").ModelSpecInventory>;
}
