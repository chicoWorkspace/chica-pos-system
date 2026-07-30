import Redis from "ioredis";

const host = process.env.REDIS_HOST;
const port = Number(process.env.REDIS_PORT ?? 6379);
const password = process.env.REDIS_PASSWORD;

export const redis = new Redis({
  host,
  port,
  password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redis.on("connecting", () => {
  console.log(`🔄 [Redis] connecting... host=${host} port=${port}`);
});

redis.on("connect", () => {
  console.log("✅ [Redis] connected");
});

redis.on("error", (err) => {
  console.error("❌ [Redis] error:", err);
});

const baseConfig = {
  host,
  port,
  password,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

function bindLogEvents(instance: Redis, label: string = "Redis") {
  instance.on("connecting", () => {
    console.log(`🔄 [${label}] connecting... host=${host} port=${port}`);
  });

  instance.on("connect", () => {
    console.log(`✅ [${label}] connected 成功連線`);
  });

  instance.on("error", (err) => {
    console.error(`❌ [${label}] error 發生錯誤:`, err);
  });

  return instance;
}


export function createRedisInstance(label: string = "Redis-Worker"): Redis {
  const newInstance = new Redis(baseConfig);
  return bindLogEvents(newInstance, label);
}