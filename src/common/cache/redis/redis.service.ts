import { ICacheProvider } from "../cache.interface";
import { createClient, RedisClientType } from "redis";

interface RedisConfig {
    url: string;
}

export class RedisCacheProvider implements ICacheProvider {
    private client: RedisClientType;

    constructor(config: RedisConfig) {
        this.client = createClient(config);

        this.client.connect().catch((error: unknown): void => {
            console.log("Redis connection error:", error);
        });
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(
        key: string,
        value: string,
        ttlSeconds: number
    ): Promise<void> {
        if (ttlSeconds) {
            await this.client.set(key, value, {
                EX: ttlSeconds,
            });

            return;
        }

        await this.client.set(key, value);
    }

    // ==============================
    // Redis Set
    // ==============================

    async addToSet(
        key: string,
        value: string
    ): Promise<void> {
        await this.client.sAdd(key, value);
    }

    async getAllFromSet(
        key: string
    ): Promise<string[]> {
        return await this.client.sMembers(key);
    }

    async rmSet(
        key: string,
        value: string
    ): Promise<void> {
        await this.client.sRem(key, value);
    }
}