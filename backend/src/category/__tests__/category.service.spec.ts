import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryService } from '../category.service';
import { CategoryEntity } from '../entities/category.entity';
import { categoryMock } from '../__mocks__/category.mock';

describe('CategoryService', () => {
    let service: CategoryService;
    let categoryRepositoy: Repository<CategoryEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService,
                {
                    provide: getRepositoryToken(CategoryEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue([categoryMock]),
                        save: jest.fn().mockResolvedValue(categoryMock),
                    },
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
        categoryRepositoy = module.get<Repository<CategoryEntity>>(
            getRepositoryToken(CategoryEntity),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(categoryRepositoy).toBeDefined();
    });

    it('should return list category', async () => {
        const categories = await service.findAllCategories();
        expect(categories).toEqual([categoryMock]);
    });

    it('should return error in list category empty', async () => {
        jest.spyOn(categoryRepositoy, 'find').mockResolvedValue([]);
        await expect(service.findAllCategories()).rejects.toThrow();
    });

    it('should return error in list category exception', async () => {
        jest.spyOn(categoryRepositoy, 'find').mockRejectedValue(
            new Error('teste'),
        );
        await expect(service.findAllCategories()).rejects.toThrow();
    });
});
