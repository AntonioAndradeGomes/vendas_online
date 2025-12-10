import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mocks__/jwt.mock';
import { loginUserMock } from '../__mocks__/login-user.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findUserByEmail: jest
                            .fn()
                            .mockResolvedValue(userEntityMock),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue(jwtMock),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(userService).toBeDefined();
        expect(jwtService).toBeDefined();
    });

    it('should return user if password and email valid', async () => {
        const user = await service.login(loginUserMock);
        expect(user).toEqual({
            accessToken: jwtMock,
            user: new ReturnUserDto(userEntityMock),
        });
    });

    it('should return error if password and email not valid', async () => {
        await expect(
            service.login({ ...loginUserMock, password: '1234' }),
        ).rejects.toThrow();
    });

    it('should return error if email not exists', async () => {
        jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(
            new NotFoundException(),
        );

        await expect(service.login(loginUserMock)).rejects.toThrow(
            NotFoundException,
        );
    });

    it('should return error in UserService', async () => {
        jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(
            new Error(),
        );

        await expect(service.login(loginUserMock)).rejects.toThrow();
    });
});
