import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'src/decorators/validators';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateGameInfoRequest {
  @ApiProperty({ example: 'Axie Infinity' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=oMa8cc6YxSI&feature=youtu.be',
  })
  @IsUrl()
  @IsNotEmpty()
  videoIntroURL: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  @IsUrl()
  @IsNotEmpty()
  logoURL: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  @IsUrl()
  @IsNotEmpty()
  backgroundURL: string;

  @ApiProperty({
    example: `Axie is a new type of game, partially owned and operated by its players. Earn AXS tokens by playing and use them to decide the future of the game!`,
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://axieinfinity.com/' })
  @IsUrl()
  @IsNotEmpty()
  gameURL: string;

  @ApiProperty({ example: 'https://api-gaming.dev.gamifyclub.com/game-server-dummy/webhook' })
  @IsUrl()
  @IsNotEmpty()
  webhookUrl: string;

  @ApiProperty({ example: 'https://api-gaming.dev.gamifyclub.com/game-server-dummy/validate-game-item' })
  @IsUrl()
  @IsNotEmpty()
  getItemUrl: string;
}
