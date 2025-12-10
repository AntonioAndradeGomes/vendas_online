import { Injectable, NotFoundException } from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
import { ReturnLoginDto } from './dtos/returnLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginPayloadDto } from './dtos/loginPayload.dto';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}
    async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
        const user: UserEntity | undefined = await this.userService
            .findUserByEmail(loginDto.email)
            .catch(() => undefined);

        const isMatch = await compare(loginDto.password, user?.password || '');
        if (!user || !isMatch) {
            throw new NotFoundException('Email or password invalid');
        }

        const accessToken: string = this.jwtService.sign({
            ...new LoginPayloadDto(user),
        });

        return {
            user: new ReturnUserDto(user),
            accessToken,
        };
    }
}
