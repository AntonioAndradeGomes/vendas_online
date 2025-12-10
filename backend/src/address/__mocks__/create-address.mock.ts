import { cityMock } from '../../city/__mocks__/city.mock';
import { CreateAddressDto } from '../dtos/createAddress.dto';

export const createAddressMock: CreateAddressDto = {
    cep: '57750000',
    cityId: cityMock.id,
    complement: 'abc',
    numberAddress: 111,
};
