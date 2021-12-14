import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const Authorize = () =>
  applyDecorators(ApiBearerAuth(), ApiUnauthorizedResponse({ description: 'Unauthorized' }));
