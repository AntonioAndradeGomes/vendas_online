import { cityMock } from '../../city/__mocks__/city.mock';
import { AddressEntity } from '../entities/address.entity';
import { userEntityMock } from '../../user/__mocks__/user.mock';

export const addressMock: AddressEntity = {
    cep: '57750000',
    cityId: cityMock.id,
    complement: 'abc',
    createdAt: new Date(),
    id: 12,
    numberAddress: 111,
    updatedAt: new Date(),
    userId: userEntityMock.id,
};
