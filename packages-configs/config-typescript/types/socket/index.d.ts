import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@repo/api-client";
/**
 * StrictIOServer 擴展自標準的 Socket.IO ，
 * 並強制在 emit 方法中使用ServerToClientEvents的事件和參數類型。
 */
type StrictIOServer = Server<ClientToServerEvents, ServerToClientEvents> & {};
declare module "fastify" {
    interface FastifyInstance {
        io: StrictIOServer;
    }
}
/**
 * 設定 Socket.IO 伺服器
 */
export declare function setupSocketIO(fastify: FastifyInstance): Promise<Server<ClientToServerEvents, ServerToClientEvents, import("socket.io").DefaultEventsMap, any>>;
export {};
