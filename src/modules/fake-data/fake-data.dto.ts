import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';

export class FakeDataRequest {
  @ApiProperty()
  @IsString()
  userAddress: string;
}
