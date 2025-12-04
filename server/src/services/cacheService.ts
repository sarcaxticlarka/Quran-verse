import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor() {
    // Default TTL of 24 hours (86400 seconds) for verse of the day
    this.cache = new NodeCache({ stdTTL: 86400, checkperiod: 600 });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  getStats() {
    return this.cache.getStats();
  }
}

export default new CacheService();
