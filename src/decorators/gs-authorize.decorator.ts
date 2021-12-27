import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

export const GsAuthorize = () => applyDecorators(ApiUnauthorizedResponse({ description: 'Unauthorized' }));
