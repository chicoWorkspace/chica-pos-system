import {
  AnnouncementClientToServerEvents,
  AnnouncementServerToClientEvents,
} from "./announcement.event";
import {
  OrderClientToServerEvents,
  OrderServerToClientEvents,
} from "./order.event";
import {
  SystemClientToServerEvents,
  SystemServerToClientEvents,
} from "./system.event";

export interface ServerToClientEvents
  extends SystemServerToClientEvents,
    OrderServerToClientEvents,
    AnnouncementServerToClientEvents {}

export interface ClientToServerEvents
  extends SystemClientToServerEvents,
    OrderClientToServerEvents,
    AnnouncementClientToServerEvents {}
