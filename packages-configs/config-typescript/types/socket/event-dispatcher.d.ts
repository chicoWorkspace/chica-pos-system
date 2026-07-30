import { Server } from "socket.io";
import { ServerToClientEvents } from "@repo/api-client";
import { RedisSocketEvent } from "@repo/api-client";
import { OrderEvent } from "@repo/api-client";
type IOServer = Server<any, ServerToClientEvents>;
export declare function dispatchSocketEvent(io: IOServer, event: RedisSocketEvent): Promise<void>;
export declare function mapRedisToOrderEvent(event: RedisSocketEvent): OrderEvent;
export {};
