import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis | null = null;
  private readonly memoryFallback = new Map<string, { value: string; expiresAt: number }>();

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT) || 6379;

    try {
      this.client = new Redis({
        host,
        port,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        retryStrategy: (times) => {
          if (times > 2) return null; // Fallback to in-memory if offline
          return 1000;
        },
      });

      this.client.connect().catch(() => {
        this.logger.warn(`Redis not reachable at ${host}:${port}. Using in-memory fallback cache.`);
        this.client = null;
      });
    } catch {
      this.logger.warn('Failed to initialize Redis client. Falling back to in-memory cache.');
      this.client = null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.client) {
      try {
        const data = await this.client.get(key);
        return data ? (JSON.parse(data) as T) : null;
      } catch {
        // Fallback
      }
    }

    const item = this.memoryFallback.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryFallback.delete(key);
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const serialized = JSON.stringify(value);
    if (this.client) {
      try {
        await this.client.set(key, serialized, 'EX', ttlSeconds);
        return;
      } catch {
        // Fallback
      }
    }

    this.memoryFallback.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.client) {
      try {
        await this.client.del(key);
        return;
      } catch {
        // Fallback
      }
    }
    this.memoryFallback.delete(key);
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}
