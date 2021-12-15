import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class MintNftItemRequest {
  @ApiProperty()
  @IsString()
  itemId: string;
}
