import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'src/decorators/validators';

export class PaginationQueryDto {
  @ApiProperty({ example: 1 })
  @IsNumber({ positive: true })
  page: number;

  @ApiProperty({ example: 20 })
  @IsNumber({ positive: true })
  pageSize: number;
}
