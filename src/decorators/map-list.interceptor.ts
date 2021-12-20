import { isEmpty, MapOptions, Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { mixin, Optional } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const defaultKey = 'default';

export const MapListInterceptor: (
  to: unknown,
  from: unknown,
  options?: { isArray?: boolean; mapperName?: string } & MapOptions,
) => NestInterceptor = memoize(createMapInterceptor);

function createMapInterceptor(
  to: unknown,
  from: unknown,
  options?: { mapperName?: string } & MapOptions,
): new (...args: any[]) => NestInterceptor {
  const { mapperName, transformedMapOptions } = getTransformOptions(options);

  class MixinMapInterceptor implements NestInterceptor {
    constructor(@Optional() @InjectMapper(mapperName) private readonly mapper?: Mapper) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
      if (shouldSkipTransform(this.mapper, to, from)) {
        return next.handle();
      }

      try {
        return next.handle().pipe(
          map((response) => {
            response.data = transformArray(response.data, this.mapper, to, from, transformedMapOptions);
            return response;
          }),
        );
      } catch {
        return next.handle();
      }
    }
  }

  return mixin(MixinMapInterceptor);
}

// eslint-disable-next-line @typescript-eslint/ban-types
function memoize(fn: Function) {
  const cache: Record<string, unknown> = {};
  return (...args: any[]) => {
    const n =
      args.reduce((key, arg) => {
        const argToConcat =
          typeof arg === 'string' ? arg : typeof arg === 'object' ? JSON.stringify(arg) : arg.toString();
        return key.concat('|', argToConcat);
      }, '') || defaultKey;
    if (n in cache) {
      return cache[n];
    }

    const result = n === defaultKey ? fn() : fn(...args);
    cache[n] = result;
    return result;
  };
}

function shouldSkipTransform(mapper: Mapper | undefined, to: unknown, from: unknown): boolean {
  return !mapper || !to || !from;
}

function transformArray(value: unknown, mapper: Mapper | undefined, to: any, from: any, options?: MapOptions) {
  if (!Array.isArray(value)) return value;
  return mapper?.mapArray(value, to, from, options);
}

function getTransformOptions(options?: { isArray?: boolean; mapperName?: string } & MapOptions): {
  mapperName?: string;
  isArray: boolean;
  transformedMapOptions?: MapOptions;
} {
  const { isArray = false, mapperName, ...mapOptions } = options || {};
  const transformedMapOptions = isEmpty(mapOptions) ? undefined : mapOptions;
  return { isArray, mapperName, transformedMapOptions };
}
