import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IsString } from 'src/decorators/validators';

export class GsdValidateGameItemRequest {
  @ApiProperty()
  @IsString()
  userAddress: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  itemId: string;
}
