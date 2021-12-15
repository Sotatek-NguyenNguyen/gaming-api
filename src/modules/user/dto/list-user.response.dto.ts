import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/dto';
import { UserResponse } from '.';

export class ListUserResponse extends PaginationResponseDto {
  @ApiProperty({ type: [UserResponse] })
  data: UserResponse[];
}
