import { AnnouncementAddParams, AnnouncementResult } from "@repo/api-client";
import { AnnouncementQuery } from "./announcement.schema";
export declare class AnnouncementService {
    private orderFeature;
    list(filters: AnnouncementQuery): Promise<AnnouncementResult>;
    add(params: AnnouncementAddParams): Promise<import("@repo/db/announcement/index.model").ModelAnnouncement>;
}
