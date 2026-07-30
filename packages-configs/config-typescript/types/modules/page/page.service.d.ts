import { PageQuery, PageCreate } from "./page.schema";
export declare class PageService {
    private feature;
    list(filter: PageQuery): Promise<import("@repo/db/page/index.type").LeanPage[]>;
    create(data: PageCreate): Promise<import("@repo/db/page/index.model").ModelPage>;
}
