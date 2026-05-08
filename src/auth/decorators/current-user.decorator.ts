import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserResp } from '../../users/users.service';

interface RequestWithUser {
  user?: UserResp;
}

export const CurrentUser = createParamDecorator(
  (data: keyof UserResp | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return data && user ? user[data] : user;
  },
);
