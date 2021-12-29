import { ApiProperty } from '@nestjs/swagger';

export class GsdValidateGameItemRequest {
  @ApiProperty()
  userAddress: string;

  @ApiProperty()
  itemId: string;
}
