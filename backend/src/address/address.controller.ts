import {
    Body,
    Controller,
    Post,
    Get,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { UserId } from 'src/decorators/user-id.decorator';
import { ReturnAddressDto } from './dtos/returnAddress.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createAddress(
        @Body() createAddress: CreateAddressDto,
        @UserId() userId: number,
    ): Promise<AddressEntity> {
        return this.addressService.createAddress(createAddress, userId);
    }

    @Get()
    async findAddressByUserId(
        @UserId() userId: number,
    ): Promise<ReturnAddressDto[]> {
        return (await this.addressService.findAddressByUserId(userId)).map(
            (address) => new ReturnAddressDto(address),
        );
    }
}
