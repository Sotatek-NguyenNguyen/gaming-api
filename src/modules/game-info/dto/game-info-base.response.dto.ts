import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class GameInfoBaseResponse {
  @ApiProperty({ example: 'Axie Infinity' })
  @AutoMap()
  name: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/website/final.webm',
  })
  @AutoMap()
  videoIntroURL: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  @AutoMap()
  logoURL: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  @AutoMap()
  backgroundURL: string;

  @ApiProperty({
    example: `Axie is a new type of game, partially owned and operated by its players. Earn AXS tokens by playing and use them to decide the future of the game!`,
  })
  @AutoMap()
  description: string;

  @ApiProperty({ example: 'https://axieinfinity.com/' })
  @AutoMap()
  gameURL: string;

  @ApiProperty()
  @AutoMap()
  programId: string;

  @ApiProperty()
  @AutoMap()
  gameId: string;

  @ApiProperty()
  @AutoMap()
  tokenAddress: string;

  @ApiProperty({ example: 'SLP' })
  @AutoMap()
  tokenCode: string;

  @ApiProperty({ example: 'Small Love Potion' })
  @AutoMap()
  tokenName: string;

  @ApiProperty({ example: '6' })
  @AutoMap()
  tokenDecimals: number;

  @ApiProperty()
  @AutoMap()
  walletAddress: string;
}
