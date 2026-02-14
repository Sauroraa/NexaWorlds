import Redis from 'ioredis';

export class RedisService {
  private client: Redis;

  constructor(url: string) {
    this.client = new Redis(url);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const sub = this.client.duplicate();
    await sub.subscribe(channel);
    sub.on('message', (_ch, message) => callback(message));
  }

  disconnect(): void {
    this.client.disconnect();
  }
}
