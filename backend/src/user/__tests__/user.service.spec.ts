import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { createUserMock } from '../__mocks__/createUser.mock';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        findOne: jest.fn().mockResolvedValue(userEntityMock),
                        save: jest.fn().mockResolvedValue(userEntityMock),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<UserEntity>>(
            getRepositoryToken(UserEntity),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });

    it('should return user in findUserByEmail', async () => {
        const user = await service.findUserByEmail(userEntityMock.email);

        expect(user).toEqual(userEntityMock);
    });

    it('should return error in findUserByEmail', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(
            service.findUserByEmail(userEntityMock.email),
        ).rejects.toThrow(NotFoundException);
    });

    it('should return error with correct message in findUserByEmail', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(
            service.findUserByEmail(userEntityMock.email),
        ).rejects.toThrow(`User with email: ${userEntityMock.email} not found`);
    });

    it('should return user in findUserById', async () => {
        const user = await service.findUserById(userEntityMock.id);

        expect(user).toEqual(userEntityMock);
    });

    it('should return error in findUserById', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null);

        await expect(service.findUserById(userEntityMock.id)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should return user in getUserByIdUsingRelations', async () => {
        const user = await service.getUserByIdUsingRelations(userEntityMock.id);

        expect(user).toEqual(userEntityMock);
    });

    it('should return error in findUserByEmail (error DB)', async () => {
        jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());

        await expect(
            service.findUserByEmail(userEntityMock.email),
        ).rejects.toThrow();
    });

    it('should return error if user exists', async () => {
        await expect(service.createUser(createUserMock)).rejects.toThrow(
            BadGatewayException,
        );
    });

    it('should return user if user not exists', async () => {
        jest.spyOn(repository, 'findOne').mockRejectedValueOnce(undefined);
        const user = await service.createUser(createUserMock);
        expect(user).toEqual(userEntityMock);
    });
});
