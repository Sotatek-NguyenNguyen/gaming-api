import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ListCurrentUserNftQuery } from './get-current-user-nft.query';

export class ListNftQuery extends ListCurrentUserNftQuery {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  userAddress: string;
}
