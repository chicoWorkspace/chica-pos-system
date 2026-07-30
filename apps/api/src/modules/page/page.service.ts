import { Page } from "@repo/db";
import { PageQuery, PageCreate } from "./page.schema";

export class PageService {
  private feature = new Page();

  async list(filter: PageQuery) {
    return this.feature.list(filter);
  }

  async create(data: PageCreate) {
    return this.feature.add({ ...data, permissions: [] });
  }
}
