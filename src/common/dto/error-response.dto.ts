import { ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiPropertyOptional({ type: Number })
  readonly status?: any;

  @ApiPropertyOptional({
    type: String,
    example: 'Error message',
    default: 'Internal Server Error',
  })
  readonly message?: any;

  @ApiPropertyOptional({ type: String, example: 'Error' })
  readonly name?: any;
}
