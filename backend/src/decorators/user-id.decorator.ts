import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginPayloadDto } from 'src/auth/dtos/loginPayload.dto';
import { authorizationToLoginPayload } from 'src/utils/base-64-converter';
import { Request } from 'express';

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
    const { authorization } = ctx.switchToHttp().getRequest<Request>().headers;
    //console.log('authorization', authorization);
    const loginPayload: LoginPayloadDto | undefined =
        authorizationToLoginPayload(authorization!);
    return loginPayload?.id;
});
