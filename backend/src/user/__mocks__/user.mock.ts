import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userEntityMock: UserEntity = {
    cpf: '12345678912',
    createdAt: new Date(),
    email: 'emailmock@gmail.com',
    name: 'Mock',
    id: 123,
    password: '$2b$10$NhIQAvLQSBFgLln4YcoUPe5VvBfVVIbzptg5EnYXVkAmK6C3fwzTq',
    phone: '312123121221',
    typeUser: UserType.User,
    updatedAt: new Date(),
};
