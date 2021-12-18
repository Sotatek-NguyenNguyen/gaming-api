import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { GameServerAuth } from 'src/guards';

export const GsAuthorize = () =>
  applyDecorators(ApiUnauthorizedResponse({ description: 'Unauthorized' }), UseGuards(GameServerAuth));
