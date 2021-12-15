import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListCurrentUserNftQuery } from './get-current-user-nft.query';

export class ListNftQuery extends ListCurrentUserNftQuery {
  @ApiPropertyOptional({})
  userId: string;
}
