import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../cache.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { UserEntity } from '../../user/entities/user.entity';

describe('CacheService', () => {
    let service: CacheService;
    let cacheManager: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CacheService,
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                    },
                },
            ],
        }).compile();
        cacheManager = module.get<Cache>(CACHE_MANAGER);
        service = module.get<CacheService>(CacheService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return dara in cache', async () => {
        jest.spyOn(cacheManager, 'get').mockResolvedValue(userEntityMock);

        const result = await service.getCache<UserEntity>(
            'key',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            () => null as any, // função não será chamada
        );

        expect(result).toEqual(userEntityMock);
    });

    it('should return data in function', async () => {
        const test = { test: 'test' };
        jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);

        const result = await service.getCache('key', () =>
            Promise.resolve(test),
        );

        expect(result).toEqual(test);
    });
});
