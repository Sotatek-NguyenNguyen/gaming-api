import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';

export class ListCurrentUserNftQuery extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: '3MNh8ihk5XfweiJvBdQtLkecnbGvzA6p7vQESuqCvC5fVZ7mLoadytJwdVg9XpVfBTvsnQbUZ9eumvqST7vJ3RMT',
  })
  @IsOptional()
  @IsString()
  address: string;
}
