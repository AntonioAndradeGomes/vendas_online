import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/returnUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UsePipes(ValidationPipe)
    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Get()
    getUsers() {
        return this.userService.getAllUsers();
    }

    @Get('/:userId')
    async getUserById(@Param('userId') userId: number) {
        const user = await this.userService.getUserByIdUsingRelations(userId);
        if (!user) {
            return {};
        }
        return new ReturnUserDto(user);
    }
}
