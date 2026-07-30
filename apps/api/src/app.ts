// apps/api/src/app.ts
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { connectToDatabase } from "@repo/db";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { authRoutes } from "./modules/auth";
import { cartRoutes } from "./modules/cart";
import { categoryRoutes } from "./modules/category";
import { cloudinaryRoutes } from "./modules/cloudinary";
import { groupRoutes } from "./modules/group";
import { groupPermissionsRoutes } from "./modules/group-permission";
import { orderRoutes } from "./modules/order";
import { pageRoutes } from "./modules/page";
import { productRoutes } from "./modules/product";
import swaggerPlugin from "./plugins/swagger";
import { GetEnvConfig } from "./utils";
import { setupSocketIO } from "./socket";
import { announcementRoutes } from "./modules/announcement";
import mongoose from "mongoose";

const config = GetEnvConfig();
const isProd = config.NODE_ENV === "production";

export async function buildServer() {
  const fastify = Fastify({
    logger: isProd
      ? { level: "info" }
      : {
          level: "debug",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              singleLine: true,
            },
          },
        },
    trustProxy: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // --- 安全與實用功能 ---
  await fastify.register(fastifyHelmet); // 選用，增加安全相關 headers
  await fastify.register(fastifyCookie); // cookie 解析

  // JWT 插件 (fastify-jwt)
  await fastify.register(fastifyJwt, {
    secret: config.JWT_SECRET ?? "change_me",
    sign: { expiresIn: config.JWT_EXPIRES ?? "1h" },
  });

  try {
    await fastify.register(fastifyRateLimit, {
      max: 100, // 每個 IP 每分鐘限制數量
      timeWindow: "1 minute", // 時間窗口
    });
  } catch (e: any) {
    fastify.log.debug("未註冊速率限制", e);
  }

  // CORS 設定，與原本 express 動態 origin 邏輯一致
  const corsList = ["https://test.chico.tw"];
  await fastify.register(fastifyCors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (
        origin.startsWith("http://localhost") ||
        corsList.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        cb(null, true);
      } else {
        cb(new Error("不允許的 CORS 請求"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  // --- Swagger 文件 ---
  fastify.register(swaggerPlugin);

  // --- 自訂錯誤處理器 ---
  fastify.setErrorHandler(
    (error: unknown, request: FastifyRequest, reply: FastifyReply) => {
      const err = error as {
        statusCode?: number;
        message?: string;
        validation?: any;
      };

      let statusCode = err.statusCode ?? 500;
      let message = err.message ?? "伺服器內部錯誤";

      // 如果是 schema 驗證錯誤 (BadRequest)
      if (
        statusCode === 400 &&
        "validation" in err &&
        Array.isArray((err as any).validation)
      ) {
        const validations = (err as any).validation as Array<any>;
        // 將每個錯誤轉成中文訊息
        const errors = validations.map((v) => {
          const prop =
            v.instancePath.replace("/", "") || v.params?.missingProperty;
          switch (v.keyword) {
            case "required":
              return `缺少必填欄位 '${prop}'`;
            case "type":
              return `'${prop}' 欄位型別錯誤`;
            case "minLength":
              return `'${prop}' 長度不足`;
            default:
              return `'${prop}' 不合法`;
          }
        });
        message = errors.join("，");
      }

      // 記錄原始錯誤
      request.log.error(error);
      reply.status(statusCode).send({
        status: "error",
        error: message,
      });
    },
  );
  // --- 404 處理 ---
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({ status: "error", error: "找不到此路由" });
  });

  const formatBody = (body: any) => {
    if (!body) return undefined;
    const str = JSON.stringify(body);
    return str.length > 500
      ? { preview: "Content too large...", size: `${str.length} bytes` }
      : body;
  };

  //請求進入 Log
  fastify.addHook("preValidation", async (req) => {
    req.log.info(
      {
        type: "REQUEST",
        method: req.method,
        url: req.url,
        // 增加 ip 與 user 追蹤 (如果有)
        userId: (req as any).user?.id,
        query:
          Object.keys(req.query as object).length > 0 ? req.query : undefined,
        body: formatBody(req.body),
      },
      `📥 收到請求: ${req.method} ${req.url}`,
    );
  });

  //回傳結果 Log
  fastify.addHook("onResponse", async (req, reply) => {
    // 根據狀態碼動態決定 Icon，成功綠燈，失敗紅燈
    const isSuccess = reply.statusCode >= 200 && reply.statusCode < 300;
    const icon = isSuccess ? "🟢" : "🔴";

    req.log.info(
      {
        type: "RESPONSE",
        method: req.method,
        url: req.url,
        statusCode: reply.statusCode,
        responseTime: `${reply.elapsedTime.toFixed(2)}ms`,
      },
      `${icon} [${reply.statusCode}] ${req.method} ${req.url} - ${reply.elapsedTime.toFixed(2)}ms`,
    );
  });

  // --- 註冊模組 / 路由  ---
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(announcementRoutes, { prefix: "/announcement" });
  fastify.register(cartRoutes, { prefix: "/cart" });
  fastify.register(categoryRoutes, { prefix: "/category" });
  fastify.register(cloudinaryRoutes, { prefix: "/cloudinary" });
  fastify.register(groupRoutes, { prefix: "/group" });
  fastify.register(groupPermissionsRoutes, { prefix: "/group-permission" });
  fastify.register(orderRoutes, { prefix: "/order" });
  fastify.register(pageRoutes, { prefix: "/page" });
  fastify.register(productRoutes, { prefix: "/product" });

  // 健康檢查
  fastify.get("/health", async (request, reply) => {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (!isMongoConnected) {
      return reply.status(503).send({
        status: "error",
        data: null,
        error: "資料庫連線異常",
      });
    }

    return {
      status: "success",
      data: { db: "connected" },
      error: null,
    };
  });

  return fastify;
}

export async function startServer() {
  await connectToDatabase();
  const server = await buildServer();

  //-- 啟動 socket.io --
  await setupSocketIO(server);

  const port = Number(config.PORT ?? 3000);
  // const port =3055;

  try {
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`API 服務器啟動: http://localhost:${port}`);
    server.log.info(`API 測試頁面啟動: http://localhost:${port}/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  // 優雅關閉
  const shutdown = async (signal: string) => {
    server.log.info(`${signal} 訊號收到，伺服器關閉中...`);

    // 設定強制關閉超時
    const forceExit = setTimeout(() => {
      server.log.error("強制關閉超時，正在退出...");
      process.exit(1);
    }, 10000);

    try {
      await server.close();
      await mongoose.connection.close();
      server.log.info("資料庫與伺服器已安全關閉");
      clearTimeout(forceExit);
      process.exit(0);
    } catch (err) {
      server.log.error(err, "優雅關閉期間發生錯誤");
      process.exit(1);
    }
  };

  process.removeAllListeners("SIGINT");
  process.removeAllListeners("SIGTERM");
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// 如果直接用 node 執行此檔案
if (require.main === module) {
  startServer();
}
