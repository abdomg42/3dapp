import Redis from "ioredis";
import dotenv from "dotenv";
import path from 'path';

// Load environment variables
dotenv.config();

// Debug: Check if .env file exists and show all environment variables
console.log('[Redis] Current working directory:', process.cwd());
console.log('[Redis] .env file path:', path.join(process.cwd(), '.env'));
console.log('[Redis] All environment variables:', Object.keys(process.env).filter(key => key.includes('REDIS') || key.includes('PG')));

// Debug: Log the REDIS_URL (masked for security)
const redisUrl = process.env.REDIS_URL;
console.log('[Redis] REDIS_URL provided:', redisUrl ? 'YES' : 'NO');
console.log('[Redis] REDIS_URL length:', redisUrl ? redisUrl.length : 0);
if (redisUrl) {
  console.log('[Redis] REDIS_URL format:', redisUrl.substring(0, 10) + '...');
  console.log('[Redis] REDIS_URL contains "redis://":', redisUrl.includes('redis://'));
}

// Check if REDIS_URL is provided
if (!redisUrl) {
  console.error('[Redis] ERROR: REDIS_URL environment variable is not set!');
  console.error('[Redis] Please set REDIS_URL in your .env file or environment variables');
  console.error('[Redis] Available env vars:', Object.keys(process.env));
  process.exit(1);
}

export const redis = new Redis(redisUrl, {
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
