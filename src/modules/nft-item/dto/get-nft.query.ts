import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';
import { ListCurrentUserNftQuery } from './get-current-user-nft.query';

export class ListNftQuery extends ListCurrentUserNftQuery {
  @ApiPropertyOptional({})
  @IsString({ optional: true })
  userAddress: string;
}
