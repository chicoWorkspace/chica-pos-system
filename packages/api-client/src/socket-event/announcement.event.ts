import { AnnouncementResult } from "../announcement/index.type";

export interface AnnouncementServerToClientEvents {
  "announcement:publish": (payload: AnnouncementResult) => void;
}

export interface AnnouncementClientToServerEvents {}
