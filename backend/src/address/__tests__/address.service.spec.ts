import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { UserService } from '../../user/user.service';
import { CityService } from '../../city/city.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { cityMock } from '../../city/__mocks__/city.mock';
import { addressMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';

describe('AddressService', () => {
    let service: AddressService;
    let repository: Repository<AddressEntity>;

    let userService: UserService;
    let cityService: CityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddressService,
                {
                    provide: UserService,
                    useValue: {
                        findUserById: jest
                            .fn()
                            .mockResolvedValue(userEntityMock),
                    },
                },
                {
                    provide: CityService,
                    useValue: {
                        findCityById: jest.fn().mockResolvedValue(cityMock),
                    },
                },
                {
                    provide: getRepositoryToken(AddressEntity),
                    useValue: {
                        save: jest.fn().mockResolvedValue(addressMock),
                    },
                },
            ],
        }).compile();

        service = module.get<AddressService>(AddressService);
        repository = module.get<Repository<AddressEntity>>(
            getRepositoryToken(AddressEntity),
        );
        userService = module.get<UserService>(UserService);
        cityService = module.get<CityService>(CityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
        expect(userService).toBeDefined();
        expect(cityService).toBeDefined();
    });

    it('should return address after save', async () => {
        const address = await service.createAddress(
            createAddressMock,
            userEntityMock.id,
        );

        expect(address).toEqual(addressMock);
    });

    it('should return error if exception in userService', async () => {
        jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(
            new Error(),
        );

        await expect(
            service.createAddress(createAddressMock, userEntityMock.id),
        ).rejects.toThrow();
    });

    it('should return error if exception in cityService', async () => {
        jest.spyOn(cityService, 'findCityById').mockRejectedValueOnce(
            new Error(),
        );

        await expect(
            service.createAddress(createAddressMock, userEntityMock.id),
        ).rejects.toThrow();
    });
});
