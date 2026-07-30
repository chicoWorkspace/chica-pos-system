import {
  AnnouncementAddParams,
  AnnouncementResult,
} from "@repo/api-client";
import { Announcement } from "@repo/db";
import { AnnouncementGetParams } from "@repo/db";
import { AnnouncementQuery } from "./announcement.schema";

export class AnnouncementService {
  private orderFeature = new Announcement();

  async list(filters: AnnouncementQuery): Promise<AnnouncementResult> {
    const { type, isActive, createdAtFrom, createdAtTo } = filters;

    const query: Partial<Record<keyof AnnouncementGetParams, any>> = {};
    if (type) query.type = type;
    if (isActive) query.isActive = isActive;

    if (createdAtFrom || createdAtTo) {
      query.createdAt = {};
      if (createdAtFrom) query.createdAt.$gte = new Date(createdAtFrom);
      if (createdAtTo) query.createdAt.$lte = new Date(createdAtTo);
    }

    const sortBy = filters.sortBy;
    const sortOrder = filters.sortOrder;

    const sortField = sortBy || "createdAt";
    const direction = sortOrder === "asc" ? 1 : -1;

    const sortOptions: Record<string, any> = {
      [sortField]: direction,
    };
    return this.orderFeature.getData(query, sortOptions);
  }

  async add(params: AnnouncementAddParams) {
    return this.orderFeature.add(params);
  }
}
