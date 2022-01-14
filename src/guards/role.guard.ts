import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { Observable } from 'rxjs';
import { UserRole } from 'src/common/constant';
import { IUserPayload } from 'src/common/interfaces';
import { ROLES_KEY } from 'src/decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const targets = [context.getHandler(), context.getClass()];
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, targets);

    if (!requiredRoles || isEmpty(requiredRoles)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!requiredRoles.includes((request.user as IUserPayload)?.role)) {
      throw new ForbiddenException(request.user.role === UserRole.Admin ? 'ONLY_ROLE_USER_ALLOWED' : '');
    }

    return true;
  }
}
