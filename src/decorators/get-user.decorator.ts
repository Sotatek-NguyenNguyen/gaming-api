import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserPayload } from 'src/common/interfaces';

export const GetUser = createParamDecorator((field: keyof IUserPayload, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return field ? request.user[field] : request.user;
});
