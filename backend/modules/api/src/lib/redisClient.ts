// @ts-ignore - redis types will be available after npm install
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

/**
 * Cliente de Redis para almacenar sesiones y datos en caché.
 */
export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on("error", (err: Error) => {
      console.error("Redis Client Error", err);
    });

    redisClient.connect().catch((err: Error) => {
      console.error("Redis Connection Error", err);
    });
  }

  return redisClient;
}

/**
 * Cierra la conexión de Redis.
 */
export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
