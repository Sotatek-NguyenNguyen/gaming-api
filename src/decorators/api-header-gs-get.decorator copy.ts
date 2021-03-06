import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiHeaderGsGet = () => applyDecorators(ApiHeader({ name: 'x-access-key', required: true }));
