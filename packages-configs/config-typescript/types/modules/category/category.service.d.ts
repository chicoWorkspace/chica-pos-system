import { CategoryAddParams, CategoryGetParams, CategoryUpdateParams } from "@repo/db/category/index.type";
import { SortOrder } from "mongoose";
export declare class CategoryService {
    private categoryFeature;
    private productFeature;
    list(filter?: CategoryGetParams, sort?: {
        [key: string]: SortOrder;
    }): Promise<import("@repo/db/category/index.type").LeanCategory[]>;
    add(params: CategoryAddParams): Promise<import("@repo/db/category/index.model").ModelCategory>;
    update(id: string, params: Partial<CategoryUpdateParams>): Promise<import("@repo/db/category/index.model").ModelCategory>;
    delete(id: string): Promise<import("@repo/db/category/index.model").ModelCategory>;
}
