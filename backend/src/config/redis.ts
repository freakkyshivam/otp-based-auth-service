import { createClient, RedisClientType } from "redis";

let redis: RedisClientType | null = null;

export const getRedis = async (): Promise<RedisClientType> => {
  if (redis && redis.isOpen) return redis;

  redis = createClient({
    url: process.env.REDIS_URL!,
    socket: {
      reconnectStrategy: retries => Math.min(retries * 50, 500),
    },
  });

  redis.on("error", err => {
    console.error("Redis error:", err);
  });

  await redis.connect();
  return redis;
};
