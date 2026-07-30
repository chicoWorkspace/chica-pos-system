// import "fastify";
// import type { Server as IOServer } from "socket.io";
// import { ServerToClientEvents } from "../socket/types/events";

// /**
//  * StrictIOServer 擴展自標準的 Socket.IO ，
//  * 並強制在 emit 方法中使用ServerToClientEvents的事件和參數類型。
//  */
// type StrictIOServer = IOServer & {
//   emit<E extends keyof ServerToClientEvents>(
//     event: E,
//     ...args: Parameters<ServerToClientEvents[E]>
//   ): boolean;
// };

// // 擴充 FastifyInstance 可使用 io 屬性
// declare module "fastify" {
//   interface FastifyInstance {
//     io: StrictIOServer;
//   }
// }


// import "fastify";
// import type { Server } from "socket.io";
// import type {
//   ServerToClientEvents,
//   ClientToServerEvents,
// } from "../socket/types/events";

// // 建立強型別 emit
// type StrictIOServer = Server<ClientToServerEvents, ServerToClientEvents> & {
//   emit<E extends keyof ServerToClientEvents>(
//     event: E,
//     ...args: Parameters<ServerToClientEvents[E]>
//   ): boolean;
// };

// declare module "fastify" {
//   interface FastifyInstance {
//     io: StrictIOServer;
//   }
// }


// import "fastify";
// import type { Server } from "socket.io";
// import type {
//   ServerToClientEvents,
//   ClientToServerEvents,
// } from "../socket/types/events";

// 建立強型別 emit
// type StrictIOServer = Server<ClientToServerEvents, ServerToClientEvents> & {
//   emit<E extends keyof ServerToClientEvents>(
//     event: E,
//     ...args: Parameters<ServerToClientEvents[E]>
//   ): boolean;
// };

// declare module "fastify" {
//   interface FastifyInstance {
//     io: StrictIOServer;
//   }
// }
