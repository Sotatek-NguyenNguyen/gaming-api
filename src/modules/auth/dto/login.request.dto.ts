import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsMongoId, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/constant';
import { IsEnum, IsString } from 'src/decorators/validators';

export class LoginRequest {
  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @Allow()
  signature: Uint8Array;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
}

export class GenerateAuthTokenTestingRequest {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  address: string;

  @IsEnum({ entity: UserRole })
  role: UserRole;
}
