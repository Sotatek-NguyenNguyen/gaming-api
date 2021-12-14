import { applyDecorators } from '@nestjs/common';
import { Schema, SchemaOptions } from '@nestjs/mongoose';

export const BaseSchema = (options?: SchemaOptions) =>
  applyDecorators(
    Schema(
      Object.assign(
        {
          strict: true,
          timestamps: true,
          toJSON: {
            virtuals: true,
          },
          toObject: {
            virtuals: true,
          },
        },
        options,
      ),
    ),
  );
