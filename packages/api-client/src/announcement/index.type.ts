import {
  AnnoncType,
  AnnouncementAttributes,
  AnnouncementLink,
  IAnnouncement,
  LeanAnnouncement,
} from "@repo/db";

interface Base extends AnnouncementAttributes {}
export type AnnouncementResult = LeanAnnouncement[];

export type  AnnouncementLinkType = AnnouncementLink;

export interface AnnouncementGetParams {
  type?: AnnoncType;
  isActive?: boolean;
  createdAtFrom?: string; //new Date() 格式範例: 2026-04-17T08:30:00Z
  createdAtTo?: string; //new Date() 格式範例: 2026-04-17T08:30:00Z
}

export interface AnnouncementAddParams {
  title: string;
  content: string;
  type: AnnoncType;
  link?: AnnouncementLink;
  order?: number;
  isActive?: boolean;
}

export interface AnnouncementUpdateParams {
  title?: string;
  content?: string;
  type?: AnnoncType;
  link?: AnnouncementLink;
  order?: number;
  isActive?: boolean;
}
