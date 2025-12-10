import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async getCache<T>(
        key: string,
        functionRequest: () => Promise<T>,
    ): Promise<T> {
        const allData: T | undefined = await this.cacheManager.get<T>(key);

        if (allData !== undefined) {
            return allData;
        }

        const data: T = await functionRequest();

        await this.cacheManager.set<T>(key, data);

        return data;
    }
}
