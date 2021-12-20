import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum as IsEnumOriginal, IsOptional, ValidationOptions } from 'class-validator';

export const IsEnum = (
  {
    defaultValue,
    entity,
    optional,
  }: {
    entity: any;
    defaultValue?: string;
    optional?: boolean;
  },
  options?: ValidationOptions,
) => {
  const decorators = [];

  if (optional) {
    decorators.push(IsOptional());
  }

  return applyDecorators(
    ...decorators,
    Transform(({ value }) => {
      return value || defaultValue;
    }),
    IsEnumOriginal(entity, options),
  );
};
