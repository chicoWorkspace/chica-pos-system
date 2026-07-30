import dotenv from "dotenv";
import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { createClient } from "redis";
import { Server } from "socket.io";
import { createAdapter } from "socket.io-redis-adapter";
import { JwtPayload } from "../types/jwt";
import { GetEnvConfig } from "../utils";
import { registerEvents } from "./event";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@repo/api-client";
import { rooms } from "./rooms";
import { Server as SocketIOServer } from "socket.io";
import { subscribeSocketEvents } from "./redis-subscriber";
import { dispatchSocketEvent } from "./event-dispatcher";
import { log } from "util";

dotenv.config();
const JWT_SECRET = GetEnvConfig().JWT_SECRET ?? "supersecret";

/**
 * StrictIOServer 擴展自標準的 Socket.IO ，
 * 並強制在 emit 方法中使用ServerToClientEvents的事件和參數類型。
 */
type StrictIOServer = Server<ClientToServerEvents, ServerToClientEvents> & {
  // emit<E extends keyof ServerToClientEvents>(
  //   event: E,
  //   ...args: Parameters<ServerToClientEvents[E]>
  // ): boolean;
  // on<E extends keyof ClientToServerEvents>(
  //   event: E,
  //   listener: (...args: Parameters<ClientToServerEvents[E]>) => void
  // ): StrictIOServer;
};

declare module "fastify" {
  interface FastifyInstance {
    io: StrictIOServer;
  }
}

/**
 * 設定 Socket.IO 伺服器
 */
export async function setupSocketIO(fastify: FastifyInstance) {
  const redisUrl = `redis://:${GetEnvConfig().REDIS_PASSWORD}@${GetEnvConfig().REDIS_HOST}:${GetEnvConfig().REDIS_PORT}`;
  
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    fastify.server,
    {
      cors: {
        origin: ["http://localhost:3000", "https://test.chico.tw"],
        credentials: true,
      },
    },
  );

  // --- Redis Adapter 多台擴充 ---
  const pubClient = createClient({
    url: redisUrl,
  });
  const subClient = pubClient.duplicate();

  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient)); // 使用 Redis Adapter用於水平擴充

    // --- Redis 訂閱者 用於接收來自 worker 的通知 ---
    const sub = createClient({ url: redisUrl, RESP: 2 });
    await sub.connect();

    // 訂閱 socket:events 頻道，並分派事件
    await subscribeSocketEvents(sub, (event) => {
      dispatchSocketEvent(io, event);
    });
  } catch (error) {
    console.error("Redis 連線失敗，Socket.IO 將無法使用 Redis Adapter:", error);
  }

  // --- fastify結束時，資源釋放 ---
  fastify.addHook("onClose", (instance, done) => {
    io.close(); // 關閉 Socket Server
    Promise.all([pubClient.quit(), subClient.quit()]).then(() => done());
  });

  // --- Socket.IO JWT 驗證 middleware ---
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        socket.data.user = { id: "guest", role: "guest" };
        return next();
        // return next(new Error("缺失驗簽，請重新登入"));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.data.user = decoded as JwtPayload;
      next();
    } catch (error) {
      console.error("JWT 驗證失敗:", error);
      return next(new Error("驗證錯誤: token解析失敗, 請嘗試重新登入"));
    }
  });

  // --- Socket.IO 事件處理 ---
  io.on("connection", (socket) => {
    fastify.log.info(
      `Socket 新用戶連線: ${socket.id}, User: ${socket.data.user?.id}`,
    );

    // 註冊事件處理
    registerEvents(io, socket);

    socket.on("disconnect", () => {
      socket.on("disconnect", (reason) => {
        fastify.log.info(`Socket 用戶離線: ${socket.id}, Reason: ${reason}`);
      });
    });
  });

  // 讓整個 Fastify API 都能用 io
  fastify.decorate("io", io);

  return io;
}
