import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from 'src/common/constant';
import { JwtAuthGuard, RoleGuard } from 'src/guards';
import { Roles } from './roles.decorator';

export const Authorize = (...roles: UserRole[]) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    Roles(roles),
    UseGuards(JwtAuthGuard, RoleGuard),
  );
