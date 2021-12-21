import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ListCurrentUserNftQuery } from './get-current-user-nft.query';

export class ListNftQuery extends ListCurrentUserNftQuery {
  @ApiPropertyOptional({})
  @IsOptional()
  userAddress: string;
}
