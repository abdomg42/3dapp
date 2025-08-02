import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.REDIS_URL,{
  connectTimeout: 10000, // 10 seconds
  retryStrategy: (times) => {
    return Math.min(times * 200, 30000); // backoff reconnects
  },
  reconnectOnError: (err) => {
    return err.message.includes('READONLY') || err.message.includes('ECONNRESET');
  },
});

redis.on('connect', () => console.log('[Redis] Connected to Upstash'));
redis.on('ready', () => console.log('[Redis] Ready'));
redis.on('error', (err) => console.error('[Redis] Error', err));
redis.on('close', () => console.warn('[Redis] Connection closed'));
redis.on('reconnecting', () => console.log('[Redis] Reconnecting...'));

// await redis.set("foo","bar")
