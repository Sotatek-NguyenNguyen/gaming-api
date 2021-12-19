import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiHeaderGsPost = () => applyDecorators(ApiHeader({ name: 'x-signature', required: true }));
