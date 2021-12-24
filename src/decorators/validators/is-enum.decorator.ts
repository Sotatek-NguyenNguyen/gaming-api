import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum as IsEnumOriginal, IsNotEmpty, IsOptional, ValidationOptions } from 'class-validator';

export const IsEnum = (
  {
    defaultValue,
    entity,
    optional = false,
    notEmpty = true,
  }: {
    entity: any;
    defaultValue?: string;
    optional?: boolean;
    notEmpty?: boolean;
  },
  options?: ValidationOptions,
) => {
  const decorators = [];

  if (optional) {
    decorators.push(IsOptional());
  }

  if (notEmpty) {
    decorators.push(IsNotEmpty());
  }

  return applyDecorators(
    ...decorators,
    Transform(({ value }) => {
      return value || defaultValue;
    }),
    IsEnumOriginal(entity, options),
  );
};
