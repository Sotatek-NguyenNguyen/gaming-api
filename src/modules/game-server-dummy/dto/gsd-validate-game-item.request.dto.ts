import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GsdValidateGameItemResponse {
  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  itemImage: string;

  @ApiPropertyOptional({ type: Object })
  metadata: any;
}
